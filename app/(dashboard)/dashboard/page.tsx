"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlaceholderNotice } from "@/components/placeholder-notice"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Factory,
  Info,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"

type MachineStatus = "HEALTHY" | "ATTENTION" | "CRITICAL"

type MachineDto = {
  id: string
  name: string
  location: string
  status: MachineStatus
  latestPrediction: { failureProbability: number; timestamp: string } | null
  latestSensorReading: {
    airTemperature: number
    processTemperature: number
    rotationalSpeed: number
    torque: number
    toolWear: number
    timestamp: string
  } | null
  nextWorkOrder: { scheduledFor: string | null; status: string } | null
}

type WorkOrderDto = {
  id: string
  machineId: string
  status: string
  priority: string
  scheduledFor: string | null
}

const statusColor: Record<MachineStatus, string> = {
  HEALTHY: "bg-green-500",
  ATTENTION: "bg-yellow-500",
  CRITICAL: "bg-red-500",
}

function statusIcon(status: MachineStatus) {
  switch (status) {
    case "HEALTHY":
      return <CheckCircle className="h-4 w-4" />
    case "ATTENTION":
      return <AlertTriangle className="h-4 w-4" />
    case "CRITICAL":
      return <AlertTriangle className="h-4 w-4" />
  }
}

function healthPercent(machine: MachineDto): number | null {
  if (!machine.latestPrediction) return null
  return Math.round((1 - machine.latestPrediction.failureProbability) * 100)
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request to ${url} failed`)
  return res.json()
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null)

  const machinesQuery = useQuery({
    queryKey: ["machines"],
    queryFn: () => fetchJson<{ machines: MachineDto[] }>("/api/machines"),
  })
  const workOrdersQuery = useQuery({
    queryKey: ["work-orders"],
    queryFn: () => fetchJson<{ workOrders: WorkOrderDto[] }>("/api/work-orders"),
  })

  const machines = machinesQuery.data?.machines ?? []
  const workOrders = workOrdersQuery.data?.workOrders ?? []
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) ?? machines[0]

  const healthyCount = machines.filter((m) => m.status === "HEALTHY").length
  const attentionCount = machines.filter((m) => m.status === "ATTENTION").length
  const criticalCount = machines.filter((m) => m.status === "CRITICAL").length
  const criticalMachines = machines.filter((m) => m.status === "CRITICAL")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Factory className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">AfriMaint</h1>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.name ? `Signed in as ${session.user.name}` : "AI Predictive Maintenance"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Sign out" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {machines.length === 0 && !machinesQuery.isLoading && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              No machines yet for your organization. Add machines to start seeing predictions here.
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machines.length}</div>
              <p className="text-xs text-muted-foreground">Active production units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
              <p className="text-xs text-muted-foreground">Operating normally</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{attentionCount}</div>
              <p className="text-xs text-muted-foreground">Maintenance soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">Immediate action</p>
            </CardContent>
          </Card>
        </div>

        {criticalMachines.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Critical Alert:</strong> {criticalMachines.map((m) => m.name).join(", ")} require immediate
              attention.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Machine Health Status</CardTitle>
                  <CardDescription>Latest prediction per machine</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {machines.map((machine) => {
                    const health = healthPercent(machine)
                    return (
                      <div key={machine.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${statusColor[machine.status]}`} />
                          <div>
                            <p className="text-sm font-medium">{machine.name}</p>
                            <p className="text-xs text-muted-foreground">{machine.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{health !== null ? `${health}%` : "No prediction yet"}</p>
                          <p className="text-xs text-muted-foreground">
                            {machine.nextWorkOrder?.scheduledFor
                              ? formatDistanceToNow(new Date(machine.nextWorkOrder.scheduledFor), { addSuffix: true })
                              : "Not scheduled"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Maintenance</CardTitle>
                  <CardDescription>Scheduled work orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workOrders.length === 0 && (
                    <p className="text-sm text-muted-foreground">No work orders scheduled.</p>
                  )}
                  {workOrders.slice(0, 5).map((wo) => (
                    <div key={wo.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {machines.find((m) => m.id === wo.machineId)?.name ?? "Unknown machine"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {wo.scheduledFor
                            ? formatDistanceToNow(new Date(wo.scheduledFor), { addSuffix: true })
                            : "Not scheduled"}
                        </p>
                      </div>
                      <Badge variant={wo.status === "OVERDUE" ? "destructive" : "secondary"}>{wo.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cost Impact</CardTitle>
                <CardDescription>Compare run-to-failure loss against predictive maintenance cost.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm">
                  <Link href="/economics">Open Economics</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="machines" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Machine List</CardTitle>
                  <CardDescription>Select a machine to view details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {machines.map((machine) => (
                    <div
                      key={machine.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        selectedMachine?.id === machine.id ? "border-primary bg-primary/10" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedMachineId(machine.id)}
                    >
                      <div className="flex items-center gap-3">
                        {statusIcon(machine.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{machine.name}</p>
                          <p className="text-xs text-muted-foreground">{machine.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{selectedMachine?.name ?? "No machine selected"}</CardTitle>
                  <CardDescription>Latest sensor reading and prediction</CardDescription>
                </CardHeader>
                {selectedMachine && (
                  <CardContent className="space-y-6">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Health Score</span>
                        <span className="text-sm text-muted-foreground">
                          {healthPercent(selectedMachine) !== null ? `${healthPercent(selectedMachine)}%` : "N/A"}
                        </span>
                      </div>
                      <Progress value={healthPercent(selectedMachine) ?? 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Status</p>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${statusColor[selectedMachine.status]}`} />
                          <span className="text-sm capitalize">{selectedMachine.status.toLowerCase()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Process Temperature</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMachine.latestSensorReading
                            ? `${selectedMachine.latestSensorReading.processTemperature.toFixed(1)}°C`
                            : "No reading yet"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Tool Wear</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMachine.latestSensorReading
                            ? `${selectedMachine.latestSensorReading.toolWear.toFixed(0)} min`
                            : "No reading yet"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Torque</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMachine.latestSensorReading
                            ? `${selectedMachine.latestSensorReading.torque.toFixed(1)} Nm`
                            : "No reading yet"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>All work orders for your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workOrders.length === 0 && (
                    <p className="text-sm text-muted-foreground">No work orders yet.</p>
                  )}
                  {workOrders.map((wo) => (
                    <div key={wo.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">
                          {machines.find((m) => m.id === wo.machineId)?.name ?? "Unknown machine"}
                        </p>
                        <p className="text-sm text-muted-foreground">Priority: {wo.priority}</p>
                      </div>
                      <Badge variant={wo.status === "OVERDUE" ? "destructive" : "outline"}>{wo.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <PlaceholderNotice>
                  [PENDING — model performance and cost-analytics metrics ship with Phase 4/5 of the implementation
                  plan]
                </PlaceholderNotice>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
