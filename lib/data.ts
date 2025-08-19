
export type Deal = {
  id: string;
  company: string;
  owner: string;
  stage: "New" | "Qualified" | "Won" | "Lost";
  amount: number;
  status: "Open" | "On Hold" | "Won" | "Lost";
  created: string; // ISO date
  closeDate?: string;
  notes?: string;
};

export const deals: Deal[] = [
  { id: "D-1001", company: "Acme Corp", owner: "Alice", stage: "New", amount: 12000, status: "Open", created: "2025-05-01", notes: "Lead from webinar" },
  { id: "D-1002", company: "Globex Inc", owner: "Bob", stage: "Qualified", amount: 30000, status: "Open", created: "2025-06-15", notes: "Budget approved" },
  { id: "D-1003", company: "Initech", owner: "Carol", stage: "Won", amount: 55000, status: "Won", created: "2025-02-10", closeDate: "2025-03-05", notes: "Annual contract" },
  { id: "D-1004", company: "Umbrella Co.", owner: "David", stage: "Lost", amount: 18000, status: "Lost", created: "2025-01-22", notes: "Chose competitor" },
  { id: "D-1005", company: "Soylent", owner: "Eve", stage: "Qualified", amount: 25000, status: "Open", created: "2025-05-21", notes: "" },
  { id: "D-1006", company: "Stark Industries", owner: "Frank", stage: "New", amount: 42000, status: "On Hold", created: "2025-07-12", notes: "Needs legal review" },
  { id: "D-1007", company: "Wayne Enterprises", owner: "Alice", stage: "New", amount: 8000, status: "Open", created: "2025-06-03" },
  { id: "D-1008", company: "Wonka Factory", owner: "Bob", stage: "Won", amount: 76000, status: "Won", created: "2025-03-18", closeDate: "2025-04-10" },
  { id: "D-1009", company: "Tyrell Corp", owner: "Carol", stage: "Qualified", amount: 19500, status: "Open", created: "2025-05-29" },
  { id: "D-1010", company: "Hooli", owner: "Eve", stage: "New", amount: 15000, status: "Open", created: "2025-07-01" }
];
