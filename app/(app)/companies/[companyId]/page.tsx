import { notFound } from "next/navigation"

import { CompanyDetailPage } from "@/components/companies/company-detail-page"
import { getCompanyById } from "@/lib/companies"

type CompanyDetailRouteProps = {
  params: Promise<{
    companyId: string
  }>
}

export default async function CompanyDetailRoute({ params }: CompanyDetailRouteProps) {
  const { companyId } = await params
  const company = getCompanyById(companyId)

  if (!company) {
    notFound()
  }

  return <CompanyDetailPage company={company} />
}
