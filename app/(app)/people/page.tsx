import * as React from "react"

import {
  Add01Icon,
  ArrowDown01Icon,
  Menu11Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PageHeader } from "@/components/page-header"
import { PageSubheader } from "@/components/page-subheader"
import { TableList } from "@/components/table-list"
import { PageContent } from "@/components/page-content"
import { PageMain } from "@/components/page-main"
import { Button } from "@/components/ui/button"

const peopleRows = [
  {
    name: "Jaxson Septimus",
    title: "Design Engineer",
    email: "jaxson@acme.com",
  },
  {
    name: "Randy Aminoff",
    title: "Product Designer",
    email: "randy@acme.com",
  },
  {
    name: "Gustavo Workman",
    title: "UX Researcher",
    email: "gustavo@acme.com",
  },
  {
    name: "Zain Aminoff",
    title: "Growth Lead",
    email: "zain@acme.com",
  },
  {
    name: "Lydia Workman",
    title: "Account Manager",
    email: "lydia@acme.com",
  },
  {
    name: "Ahmad Stanton",
    title: "Customer Success",
    email: "ahmad@acme.com",
  },
]

export default function PeoplePage() {
  return (
    <PageMain>
      <PageHeader
        breadcrumbs={[{ label: "People" }, { label: "All People" }]}
        actions={
          <Button variant="outline" size="default">
            <HugeiconsIcon icon={Add01Icon} strokeWidth={1.5} className="text-muted-foreground" />
            New record
          </Button>
        }
      />
      <PageSubheader
        actions={
          <div className="flex items-center">
            <Button variant="ghost" size="default">
              Filter
            </Button>
            <Button variant="ghost" size="default">
              Sort
            </Button>
            <Button variant="ghost" size="default">
              Options
            </Button>
          </div>
        }
      >
        <Button variant="ghost">
          <HugeiconsIcon icon={Menu11Icon} strokeWidth={1.5} className="text-muted-foreground" />
          <span>All People</span>
          <span className="text-muted-foreground">&middot; {peopleRows.length}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={1.5}
            className="text-muted-foreground"
          />
        </Button>
      </PageSubheader>
      <PageContent>
        <TableList rows={peopleRows} />
      </PageContent>
    </PageMain>
  )
}
