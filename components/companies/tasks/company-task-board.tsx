"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Delete02Icon, Edit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  companyTaskStatusLabel,
  companyTaskStatusOrder,
  createCompanyTaskId,
  type CompanyTaskItem,
  type CompanyTaskStatus,
} from "@/lib/company-tasks"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TaskDraft = {
  title: string
  subtitle: string
  status: CompanyTaskStatus
}

type CompanyTaskBoardProps = {
  tasks: CompanyTaskItem[]
  onTasksChange: (next: CompanyTaskItem[]) => void
  companyId: string
  readOnly?: boolean
}

function createEmptyTaskDraft(status: CompanyTaskStatus = "todo"): TaskDraft {
  return {
    title: "",
    subtitle: "",
    status,
  }
}

type TaskRowContentProps = {
  task: CompanyTaskItem
  isEditing: boolean
  taskDraft: TaskDraft | null
  taskDraftError: string | null
  onStartEdit: (task: CompanyTaskItem) => void
  onDelete: (taskId: string) => void
  onDraftChange: (draft: TaskDraft) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onToggleDone: (taskId: string, checked: boolean) => void
  readOnly: boolean
  interactive?: boolean
}

function TaskRowContent({
  task,
  isEditing,
  taskDraft,
  taskDraftError,
  onStartEdit,
  onDelete,
  onDraftChange,
  onSaveEdit,
  onCancelEdit,
  onToggleDone,
  readOnly,
  interactive = true,
}: TaskRowContentProps) {
  const activeDraft = isEditing ? taskDraft : null
  const isDone = task.status === "done"

  return (
    <>
      <div className="mt-0.5 shrink-0">
        <Checkbox
          checked={isDone}
          onCheckedChange={(checked) => onToggleDone(task.id, checked === true)}
          aria-label={isDone ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
          disabled={isEditing || !interactive || readOnly}
          onPointerDown={(event) => {
            if (interactive) event.stopPropagation()
          }}
          onClick={(event) => {
            if (interactive) event.stopPropagation()
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        {isEditing && activeDraft ? (
          <div className="space-y-2">
            <Input
              value={activeDraft.title}
              onChange={(event) => onDraftChange({ ...activeDraft, title: event.target.value })}
              placeholder="Task title"
              className="h-7"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  onSaveEdit()
                }
                if (event.key === "Escape") {
                  event.preventDefault()
                  onCancelEdit()
                }
              }}
              autoFocus
            />
            <Input
              value={activeDraft.subtitle}
              onChange={(event) => onDraftChange({ ...activeDraft, subtitle: event.target.value })}
              placeholder="Task subtitle"
              className="h-7"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  onSaveEdit()
                }
                if (event.key === "Escape") {
                  event.preventDefault()
                  onCancelEdit()
                }
              }}
            />
            <div className="flex items-center gap-2">
              <Select
                value={activeDraft.status}
                onValueChange={(value) => onDraftChange({ ...activeDraft, status: value as CompanyTaskStatus })}
              >
                <SelectTrigger className="min-w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  {companyTaskStatusOrder.map((status) => (
                    <SelectItem key={status} value={status}>
                      {companyTaskStatusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-7 px-2.5" onClick={onSaveEdit}>
                Save
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2.5" onClick={onCancelEdit}>
                Cancel
              </Button>
            </div>
            {taskDraftError ? <div className="text-destructive text-xs">{taskDraftError}</div> : null}
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="truncate text-sm font-medium">{task.title}</div>
              <div className="relative flex shrink-0 items-center">
                <span
                  className={cn(
                    "text-muted-foreground pt-0.5 text-sm transition-opacity",
                    interactive && !readOnly && "md:group-hover/task-row:opacity-0 md:group-focus-within/task-row:opacity-0"
                  )}
                >
                  {task.timeLabel}
                </span>
                {interactive && !readOnly ? (
                  <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-0.5 md:opacity-0 md:transition-opacity md:duration-150 md:group-hover/task-row:opacity-100 md:group-focus-within/task-row:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${task.title}`}
                      className="text-muted-foreground hover:text-foreground"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation()
                        onStartEdit(task)
                      }}
                    >
                      <HugeiconsIcon icon={Edit01Icon} strokeWidth={1.7} className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${task.title}`}
                      className="text-muted-foreground hover:text-destructive"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation()
                        onDelete(task.id)
                      }}
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.7} className="size-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="text-muted-foreground truncate text-sm leading-6">{task.subtitle}</div>
          </>
        )}
      </div>
    </>
  )
}

type SortableTaskRowProps = {
  task: CompanyTaskItem
  isEditing: boolean
  taskDraft: TaskDraft | null
  taskDraftError: string | null
  onStartEdit: (task: CompanyTaskItem) => void
  onDelete: (taskId: string) => void
  onDraftChange: (draft: TaskDraft) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  isDraggingTask: boolean
  isDragOverTask: boolean
  onToggleDone: (taskId: string, checked: boolean) => void
  readOnly: boolean
}

const SortableTaskRow = React.memo(
  function SortableTaskRow({
    task,
    isEditing,
    taskDraft,
    taskDraftError,
    onStartEdit,
    onDelete,
    onDraftChange,
    onSaveEdit,
    onCancelEdit,
    isDraggingTask,
    isDragOverTask,
    onToggleDone,
    readOnly,
  }: SortableTaskRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task.id,
      disabled: isEditing || readOnly,
    })

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          "group/task-row relative flex items-start gap-2.5 px-4 py-3 will-change-transform",
          (task.highlighted || isEditing) && "bg-muted/40",
          !isEditing && !readOnly && "cursor-grab active:cursor-grabbing touch-none",
          (isDragging || isDraggingTask) && "bg-muted/25 [&>*]:opacity-0",
          isDragOverTask && "bg-primary/10"
        )}
        style={{
          transform: CSS.Translate.toString(transform),
          transition: isDragging ? undefined : transition,
        }}
      >
        <TaskRowContent
          task={task}
          isEditing={isEditing}
          taskDraft={taskDraft}
          taskDraftError={taskDraftError}
          onStartEdit={onStartEdit}
          onDelete={onDelete}
          onDraftChange={onDraftChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onToggleDone={onToggleDone}
          readOnly={readOnly}
        />
      </div>
    )
  },
  (prev, next) =>
    prev.task === next.task &&
    prev.isEditing === next.isEditing &&
    prev.taskDraft === next.taskDraft &&
    prev.taskDraftError === next.taskDraftError &&
    prev.isDraggingTask === next.isDraggingTask &&
    prev.isDragOverTask === next.isDragOverTask &&
    prev.readOnly === next.readOnly
)

function TaskDragOverlayRow({ task, readOnly }: { task: CompanyTaskItem; readOnly: boolean }) {
  return (
    <div className="pointer-events-none relative z-[999] flex min-w-[420px] max-w-[520px] items-start gap-2.5 rounded-md bg-background px-4 py-3 shadow-xl ring-1 ring-border/80">
      <TaskRowContent
        task={task}
        isEditing={false}
        taskDraft={null}
        taskDraftError={null}
        onStartEdit={() => undefined}
        onDelete={() => undefined}
        onDraftChange={() => undefined}
        onSaveEdit={() => undefined}
        onCancelEdit={() => undefined}
        onToggleDone={() => undefined}
        readOnly={readOnly}
        interactive={false}
      />
    </div>
  )
}

function TaskComposer({
  draft,
  error,
  onDraftChange,
  onSave,
  onCancel,
}: {
  draft: TaskDraft
  error: string | null
  onDraftChange: (draft: TaskDraft) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="bg-muted/30 border-b px-4 py-3">
      <div className="mb-2 text-sm font-medium">Add task</div>
      <div className="space-y-2">
        <Input
          value={draft.title}
          onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
          placeholder="Task title"
          className="h-8"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onSave()
            }
            if (event.key === "Escape") {
              event.preventDefault()
              onCancel()
            }
          }}
          autoFocus
        />
        <Input
          value={draft.subtitle}
          onChange={(event) => onDraftChange({ ...draft, subtitle: event.target.value })}
          placeholder="Task subtitle"
          className="h-8"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onSave()
            }
            if (event.key === "Escape") {
              event.preventDefault()
              onCancel()
            }
          }}
        />
        <div className="flex items-center gap-2">
          <Select
            value={draft.status}
            onValueChange={(value) => onDraftChange({ ...draft, status: value as CompanyTaskStatus })}
          >
            <SelectTrigger className="min-w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {companyTaskStatusOrder.map((status) => (
                <SelectItem key={status} value={status}>
                  {companyTaskStatusLabel[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 px-3" onClick={onSave}>
            Create
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        {error ? <div className="text-destructive text-xs">{error}</div> : null}
      </div>
    </div>
  )
}

export function CompanyTaskBoard({
  tasks,
  onTasksChange,
  companyId,
  readOnly = false,
}: CompanyTaskBoardProps) {
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null)
  const [taskDraft, setTaskDraft] = React.useState<TaskDraft | null>(null)
  const [taskDraftError, setTaskDraftError] = React.useState<string | null>(null)
  const [creatingTask, setCreatingTask] = React.useState(false)
  const [createTaskDraft, setCreateTaskDraft] = React.useState<TaskDraft>(() => createEmptyTaskDraft())
  const [createTaskError, setCreateTaskError] = React.useState<string | null>(null)
  const [draggingTaskId, setDraggingTaskId] = React.useState<string | null>(null)
  const [dragOverTaskId, setDragOverTaskId] = React.useState<string | null>(null)
  const taskDndSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  )

  React.useEffect(() => {
    setEditingTaskId(null)
    setTaskDraft(null)
    setTaskDraftError(null)
    setCreatingTask(false)
    setCreateTaskDraft(createEmptyTaskDraft())
    setCreateTaskError(null)
    setDraggingTaskId(null)
    setDragOverTaskId(null)
  }, [companyId])

  const taskItemIds = tasks.map((task) => task.id)
  const draggingTask = draggingTaskId ? tasks.find((task) => task.id === draggingTaskId) ?? null : null

  const startTaskEdit = (task: CompanyTaskItem) => {
    setEditingTaskId(task.id)
    setTaskDraft({
      title: task.title,
      subtitle: task.subtitle,
      status: task.status,
    })
    setTaskDraftError(null)
  }

  const cancelTaskEdit = () => {
    setEditingTaskId(null)
    setTaskDraft(null)
    setTaskDraftError(null)
  }

  const saveTaskEdit = () => {
    if (!editingTaskId || !taskDraft) return

    const title = taskDraft.title.trim()
    if (!title) {
      setTaskDraftError("Task title is required")
      return
    }

    const subtitle = taskDraft.subtitle.trim()
    onTasksChange(
      tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title,
              subtitle: subtitle || "No detail",
              status: taskDraft.status,
            }
          : task
      )
    )
    cancelTaskEdit()
  }

  const deleteTask = (taskId: string) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId))

    if (editingTaskId === taskId) {
      cancelTaskEdit()
    }
  }

  const startCreateTask = () => {
    setCreatingTask(true)
    setCreateTaskDraft(createEmptyTaskDraft())
    setCreateTaskError(null)
  }

  const cancelCreateTask = () => {
    setCreatingTask(false)
    setCreateTaskDraft(createEmptyTaskDraft())
    setCreateTaskError(null)
  }

  const saveCreateTask = () => {
    const title = createTaskDraft.title.trim()
    if (!title) {
      setCreateTaskError("Task title is required")
      return
    }

    const subtitle = createTaskDraft.subtitle.trim()
    onTasksChange([
      {
        id: createCompanyTaskId(companyId),
        status: createTaskDraft.status,
        title,
        subtitle: subtitle || "No detail",
        timeLabel: "now",
      },
      ...tasks,
    ])
    cancelCreateTask()
  }

  const handleTaskDragStart = (event: DragStartEvent) => {
    if (readOnly) return
    setDraggingTaskId(String(event.active.id))
    setDragOverTaskId(null)
  }

  const handleTaskDragCancel = () => {
    setDraggingTaskId(null)
    setDragOverTaskId(null)
  }

  const handleTaskDragOver = (event: DragOverEvent) => {
    if (readOnly) return
    const overId = event.over ? String(event.over.id) : null
    setDragOverTaskId((previous) => (previous === overId ? previous : overId))
  }

  const handleTaskDragEnd = (event: DragEndEvent) => {
    if (readOnly) return

    const activeTaskId = String(event.active.id)
    const overTaskId = event.over ? String(event.over.id) : null
    if (!overTaskId || overTaskId === activeTaskId) {
      handleTaskDragCancel()
      return
    }

    const sourceTask = tasks.find((task) => task.id === activeTaskId)
    const targetTask = tasks.find((task) => task.id === overTaskId)
    if (!sourceTask || !targetTask) {
      handleTaskDragCancel()
      return
    }

    const remaining = tasks.filter((task) => task.id !== activeTaskId)
    const targetIndex = remaining.findIndex((task) => task.id === overTaskId)
    if (targetIndex === -1) {
      handleTaskDragCancel()
      return
    }

    const movedTask: CompanyTaskItem = {
      ...sourceTask,
      status: targetTask.status,
      highlighted: false,
      timeLabel: "now",
    }

    onTasksChange([
      ...remaining.slice(0, targetIndex),
      movedTask,
      ...remaining.slice(targetIndex),
    ])
    handleTaskDragCancel()
  }

  const toggleTaskDone = (taskId: string, checked: boolean) => {
    if (readOnly) return

    onTasksChange(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: checked ? "done" : "todo",
              highlighted: false,
              timeLabel: "now",
            }
          : task
      )
    )
  }

  return (
    <div>
      {!readOnly ? (
        <div className="px-4 py-3">
          {!creatingTask ? (
            <Button
              variant="outline"
              className="h-8 w-full border-dashed opacity-70 hover:opacity-100"
              onClick={startCreateTask}
            >
              Add task
            </Button>
          ) : null}
        </div>
      ) : null}

      {!readOnly && creatingTask ? (
        <TaskComposer
          draft={createTaskDraft}
          error={createTaskError}
          onDraftChange={setCreateTaskDraft}
          onSave={saveCreateTask}
          onCancel={cancelCreateTask}
        />
      ) : null}

      <DndContext
        id={`company-task-dnd-${companyId}`}
        sensors={taskDndSensors}
        collisionDetection={closestCenter}
        onDragStart={handleTaskDragStart}
        onDragOver={handleTaskDragOver}
        onDragEnd={handleTaskDragEnd}
        onDragCancel={handleTaskDragCancel}
      >
        <SortableContext items={taskItemIds} strategy={verticalListSortingStrategy}>
          <div>
            {tasks.map((task) => (
              <SortableTaskRow
                key={task.id}
                task={task}
                isEditing={editingTaskId === task.id}
                taskDraft={taskDraft}
                taskDraftError={taskDraftError}
                onStartEdit={startTaskEdit}
                onDelete={deleteTask}
                onDraftChange={setTaskDraft}
                onSaveEdit={saveTaskEdit}
                onCancelEdit={cancelTaskEdit}
                isDraggingTask={draggingTaskId === task.id}
                isDragOverTask={dragOverTaskId === task.id && draggingTaskId !== task.id}
                onToggleDone={toggleTaskDone}
                readOnly={readOnly}
              />
            ))}
          </div>
        </SortableContext>
        {typeof document !== "undefined"
          ? createPortal(
              <DragOverlay dropAnimation={null}>
                {draggingTask ? <TaskDragOverlayRow task={draggingTask} readOnly={readOnly} /> : null}
              </DragOverlay>,
              document.body
            )
          : null}
      </DndContext>
    </div>
  )
}
