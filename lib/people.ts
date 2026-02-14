export type PersonOption = {
  id: string
  name: string
  email?: string
}

export const PEOPLE_OPTIONS: PersonOption[] = [
  { id: "system", name: "System", email: "system@graycrm.local" },
  { id: "linh-tran", name: "Linh Tran", email: "linh@acme.com" },
  { id: "ngoc-tran", name: "Ngoc Tran", email: "ngoc@acme.com" },
  { id: "hung-nguyen", name: "Hung Nguyen", email: "hung@acme.com" },
  { id: "mai-le", name: "Mai Le", email: "mai@acme.com" },
  { id: "duc-nguyen", name: "Duc Nguyen", email: "duc@acme.com" },
  { id: "duy-pham", name: "Duy Pham", email: "duy@acme.com" },
  { id: "trang-vo", name: "Trang Vo", email: "trang@acme.com" },
  { id: "lan-anh", name: "Lan Anh", email: "lan-anh@acme.com" },
  { id: "phuong-le", name: "Phuong Le", email: "phuong@acme.com" },
  { id: "kiet-pham", name: "Kiet Pham", email: "kiet@acme.com" },
  { id: "minh-nguyen", name: "Minh Nguyen", email: "minh@acme.com" },
  { id: "khanh-nguyen", name: "Khanh Nguyen", email: "khanh@acme.com" },
  { id: "hoang-le", name: "Hoang Le", email: "hoang@acme.com" },
  { id: "bao-tran", name: "Bao Tran", email: "bao@acme.com" },
  { id: "thao-nguyen", name: "Thao Nguyen", email: "thao@acme.com" },
]

const PERSON_BY_ID = new Map(PEOPLE_OPTIONS.map((person) => [person.id, person]))
const PERSON_BY_NAME = new Map(PEOPLE_OPTIONS.map((person) => [person.name, person]))

export function getPersonById(personId?: string) {
  if (!personId) return null
  return PERSON_BY_ID.get(personId) ?? null
}

export function getPersonNameById(personId?: string, fallback?: string) {
  const person = getPersonById(personId)
  return person?.name ?? fallback ?? "Unknown"
}

export function getPersonIdByName(name?: string) {
  if (!name) return undefined
  return PERSON_BY_NAME.get(name)?.id
}
