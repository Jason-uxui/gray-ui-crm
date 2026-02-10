import * as React from "react"

import { PageHeader } from "@/components/page-header"
import { PageSubheader } from "@/components/page-subheader"
import { TableList } from "@/components/table-list"
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
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="People" description="All people in your workspace." />
      <PageSubheader>
        <Button variant="secondary">All People</Button>
      </PageSubheader>
      <TableList rows={peopleRows} />
    </div>
  )
}
