import * as React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export type TableListRow = {
  name: string
  title: string
  email: string
}

type TableListProps = {
  rows: TableListRow[]
}

export function TableList({ rows }: TableListProps) {
  return (
    <Card>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[48px]">
                <input type="checkbox" className="h-4 w-4" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.email}>
                <TableCell>
                  <input type="checkbox" className="h-4 w-4" />
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="ghost">Add new</Button>
      </CardFooter>
    </Card>
  )
}
