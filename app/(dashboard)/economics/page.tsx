"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type MachineDto = { id: string; name: string }
type ReportDto = {
  id: string
  runToFailureLossKsh: number
  predictiveMaintenanceCostKsh: number
  netSavingsKsh: number
  createdAt: string
  machine: { name: string }
}

async function fetchMachines(): Promise<{ machines: MachineDto[] }> {
  const res = await fetch("/api/machines")
  if (!res.ok) throw new Error("Failed to load machines")
  return res.json()
}

async function fetchReports(): Promise<{ reports: ReportDto[] }> {
  const res = await fetch("/api/economics")
  if (!res.ok) throw new Error("Failed to load reports")
  return res.json()
}

export default function EconomicsPage() {
  const queryClient = useQueryClient()
  const machinesQuery = useQuery({ queryKey: ["machines"], queryFn: fetchMachines })
  const reportsQuery = useQuery({ queryKey: ["economic-reports"], queryFn: fetchReports })

  const [machineId, setMachineId] = useState("")
  const [idleWorkers, setIdleWorkers] = useState(2)
  const [runToFailureHours, setRunToFailureHours] = useState(6)
  const [predictiveHours, setPredictiveHours] = useState(2)
  const [pmCost, setPmCost] = useState(3000)

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/economics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineId,
          idleWorkers,
          runToFailureDowntimeHours: runToFailureHours,
          predictiveDowntimeHours: predictiveHours,
          preventiveMaintenanceCostKsh: pmCost,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to compute scenario")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["economic-reports"] }),
  })

  const machines = machinesQuery.data?.machines ?? []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Economics</h1>
      <p className="mb-8 text-muted-foreground">
        Run-to-failure vs. predictive-maintenance cost comparison, using your organization&apos;s cost matrix.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compute a scenario</CardTitle>
            <CardDescription>Compares run-to-failure loss against predictive maintenance cost.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Machine</Label>
              <select
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
              >
                <option value="">Select a machine...</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Idle workers</Label>
                <Input type="number" value={idleWorkers} onChange={(e) => setIdleWorkers(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Run-to-failure downtime (hrs)</Label>
                <Input
                  type="number"
                  value={runToFailureHours}
                  onChange={(e) => setRunToFailureHours(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Predictive downtime (hrs)</Label>
                <Input
                  type="number"
                  value={predictiveHours}
                  onChange={(e) => setPredictiveHours(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Preventive maintenance cost (KSH)</Label>
                <Input type="number" value={pmCost} onChange={(e) => setPmCost(Number(e.target.value))} />
              </div>
            </div>

            <Button onClick={() => mutation.mutate()} disabled={!machineId || mutation.isPending}>
              {mutation.isPending ? "Computing..." : "Compute"}
            </Button>

            {mutation.isError && (
              <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
            )}

            {mutation.isSuccess && (
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex justify-between text-sm">
                  <span>Run-to-failure loss</span>
                  <span className="font-medium">KSH {mutation.data.result.runToFailureLossKsh.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Predictive maintenance cost</span>
                  <span className="font-medium">
                    KSH {mutation.data.result.predictiveMaintenanceCostKsh.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-green-600">
                  <span>Net savings ({mutation.data.result.netSavingsPercent}%)</span>
                  <span>KSH {mutation.data.result.netSavingsKsh.toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent reports</CardTitle>
            <CardDescription>Last 20 computed scenarios for your organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportsQuery.data?.reports.length === 0 && (
              <p className="text-sm text-muted-foreground">No reports yet — compute a scenario to get started.</p>
            )}
            {reportsQuery.data?.reports.map((r) => (
              <div key={r.id} className="rounded-lg border p-3 text-sm">
                <div className="mb-1 font-medium">{r.machine.name}</div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Net savings</span>
                  <span className="font-medium text-green-600">KSH {r.netSavingsKsh.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
