"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CostMatrixDto = {
  id: string
  hourlyUnits: number
  profitPerUnitKsh: number
  dailyWageKsh: number
  shiftHours: number
  emergencyPartsCostKsh: number
}

type SummaryDto = {
  reportCount: number
  totalNetSavingsKsh: number
  totalRunToFailureLossKsh: number
  averageSavingsPercent: number
}

async function fetchCostMatrix(): Promise<{ costMatrix: CostMatrixDto | null; summary: SummaryDto }> {
  const res = await fetch("/api/cost-matrix")
  if (!res.ok) throw new Error("Failed to load cost matrix")
  return res.json()
}

export default function FinancePage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ["cost-matrix"], queryFn: fetchCostMatrix })

  const canEdit = session?.user?.role === "FINANCE" || session?.user?.role === "ADMIN"

  const [form, setForm] = useState<Omit<CostMatrixDto, "id"> | null>(null)

  useEffect(() => {
    if (data?.costMatrix) {
      const { id, ...rest } = data.costMatrix
      setForm(rest)
    }
  }, [data?.costMatrix])

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/cost-matrix", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update cost matrix")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cost-matrix"] }),
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Finance</h1>
      <p className="mb-8 text-muted-foreground">
        Organization-wide cost assumptions and cumulative predictive-maintenance savings.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Savings summary</CardTitle>
            <CardDescription>Aggregated across every computed scenario (see Economics).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            {data?.summary && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Scenarios computed</span>
                  <span className="font-medium">{data.summary.reportCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total run-to-failure loss</span>
                  <span className="font-medium">KSH {data.summary.totalRunToFailureLossKsh.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-green-600">
                  <span>Total net savings ({data.summary.averageSavingsPercent.toFixed(1)}%)</span>
                  <span>KSH {data.summary.totalNetSavingsKsh.toLocaleString()}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost matrix</CardTitle>
            <CardDescription>
              {canEdit
                ? "These assumptions feed every Economics calculation for your organization."
                : "Read-only — only Finance or Admin roles can edit these values."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {form && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hourly units produced</Label>
                    <Input
                      type="number"
                      disabled={!canEdit}
                      value={form.hourlyUnits}
                      onChange={(e) => setForm({ ...form, hourlyUnits: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profit per unit (KSH)</Label>
                    <Input
                      type="number"
                      disabled={!canEdit}
                      value={form.profitPerUnitKsh}
                      onChange={(e) => setForm({ ...form, profitPerUnitKsh: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily wage (KSH)</Label>
                    <Input
                      type="number"
                      disabled={!canEdit}
                      value={form.dailyWageKsh}
                      onChange={(e) => setForm({ ...form, dailyWageKsh: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Shift hours</Label>
                    <Input
                      type="number"
                      disabled={!canEdit}
                      value={form.shiftHours}
                      onChange={(e) => setForm({ ...form, shiftHours: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Emergency parts cost (KSH)</Label>
                    <Input
                      type="number"
                      disabled={!canEdit}
                      value={form.emergencyPartsCostKsh}
                      onChange={(e) => setForm({ ...form, emergencyPartsCostKsh: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {canEdit && (
                  <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save changes"}
                  </Button>
                )}
                {mutation.isError && <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>}
                {mutation.isSuccess && <p className="text-sm text-green-600">Saved.</p>}
              </>
            )}
            {!isLoading && !data?.costMatrix && (
              <p className="text-sm text-muted-foreground">No cost matrix configured yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
