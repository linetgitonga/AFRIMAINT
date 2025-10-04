"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Factory,
  Moon,
  Settings,
  Sun,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react"
import { useTheme } from "next-themes"

// Mock data for demonstration
const machines = [
  {
    id: 1,
    name: "Injection Molding Machine A",
    status: "healthy",
    health: 92,
    nextMaintenance: "12 days",
    location: "Production Floor 1",
    temperature: 68,
    vibration: "Normal",
    lastService: "2024-01-15",
  },
  {
    id: 2,
    name: "CNC Lathe B",
    status: "attention",
    health: 73,
    nextMaintenance: "3 days",
    location: "Production Floor 2",
    temperature: 82,
    vibration: "Elevated",
    lastService: "2023-12-20",
  },
  {
    id: 3,
    name: "Hydraulic Press C",
    status: "critical",
    health: 45,
    nextMaintenance: "Overdue",
    location: "Production Floor 1",
    temperature: 95,
    vibration: "High",
    lastService: "2023-11-10",
  },
  {
    id: 4,
    name: "Conveyor System D",
    status: "healthy",
    health: 88,
    nextMaintenance: "8 days",
    location: "Assembly Line",
    temperature: 72,
    vibration: "Normal",
    lastService: "2024-01-20",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-green-500"
    case "attention":
      return "bg-yellow-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4" />
    case "attention":
      return <AlertTriangle className="h-4 w-4" />
    case "critical":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

export default function AfriMaintDashboard() {
  const { theme, setTheme } = useTheme()
  const [selectedMachine, setSelectedMachine] = useState(machines[0])

  const healthyMachines = machines.filter((m) => m.status === "healthy").length
  const attentionMachines = machines.filter((m) => m.status === "attention").length
  const criticalMachines = machines.filter((m) => m.status === "critical").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Factory className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">AfriMaint</h1>
                  <p className="text-sm text-muted-foreground">AI Predictive Maintenance</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <div className="text-2xl font-bold text-green-600">{healthyMachines}</div>
              <p className="text-xs text-muted-foreground">Operating normally</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{attentionMachines}</div>
              <p className="text-xs text-muted-foreground">Maintenance soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalMachines}</div>
              <p className="text-xs text-muted-foreground">Immediate action</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {criticalMachines > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Critical Alert:</strong> {criticalMachines} machine(s) require immediate attention. Check
              Hydraulic Press C - maintenance overdue by 5 days.
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Machine Health Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Machine Health Status</CardTitle>
                  <CardDescription>Real-time health monitoring of all production equipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {machines.map((machine) => (
                    <div key={machine.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`} />
                        <div>
                          <p className="font-medium text-sm">{machine.name}</p>
                          <p className="text-xs text-muted-foreground">{machine.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{machine.health}%</p>
                        <p className="text-xs text-muted-foreground">{machine.nextMaintenance}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Maintenance */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Maintenance</CardTitle>
                  <CardDescription>Scheduled maintenance based on AI predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                    <Clock className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Hydraulic Press C</p>
                      <p className="text-xs text-muted-foreground">Overdue - Schedule immediately</p>
                    </div>
                    <Badge variant="destructive">Overdue</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">CNC Lathe B</p>
                      <p className="text-xs text-muted-foreground">Due in 3 days</p>
                    </div>
                    <Badge variant="secondary">Soon</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Conveyor System D</p>
                      <p className="text-xs text-muted-foreground">Due in 8 days</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Savings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">$2,340</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downtime Reduced</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">23%</div>
                  <p className="text-xs text-muted-foreground">Compared to last quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Gain</CardTitle>
                  <Zap className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">15%</div>
                  <p className="text-xs text-muted-foreground">Production efficiency</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="machines" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Machine List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Machine List</CardTitle>
                  <CardDescription>Select a machine to view details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {machines.map((machine) => (
                    <div
                      key={machine.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMachine.id === machine.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedMachine(machine)}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(machine.status)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{machine.name}</p>
                          <p className="text-xs text-muted-foreground">{machine.location}</p>
                        </div>
                        <Badge
                          variant={
                            machine.status === "healthy"
                              ? "default"
                              : machine.status === "attention"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {machine.health}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Machine Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{selectedMachine.name}</CardTitle>
                  <CardDescription>Detailed machine health and maintenance information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Health Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Health Score</span>
                      <span className="text-sm text-muted-foreground">{selectedMachine.health}%</span>
                    </div>
                    <Progress value={selectedMachine.health} className="h-2" />
                  </div>

                  {/* Status Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedMachine.status)}`} />
                        <span className="text-sm capitalize">{selectedMachine.status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Next Maintenance</p>
                      <p className="text-sm text-muted-foreground">{selectedMachine.nextMaintenance}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Temperature</p>
                      <p className="text-sm text-muted-foreground">{selectedMachine.temperature}°C</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Vibration</p>
                      <p className="text-sm text-muted-foreground">{selectedMachine.vibration}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Wrench className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                    <Button variant="outline" size="sm">
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>AI-powered maintenance predictions and scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {machines.map((machine) => (
                    <div key={machine.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(machine.status)}`} />
                        <div>
                          <p className="font-medium">{machine.name}</p>
                          <p className="text-sm text-muted-foreground">Last service: {machine.lastService}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Next: {machine.nextMaintenance}</p>
                          <p className="text-xs text-muted-foreground">Health: {machine.health}%</p>
                        </div>
                        <Button size="sm" variant={machine.status === "critical" ? "destructive" : "outline"}>
                          {machine.status === "critical" ? "Urgent" : "Schedule"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Impact Analysis</CardTitle>
                  <CardDescription>Financial benefits of predictive maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Maintenance Costs Saved</span>
                      <span className="text-sm font-medium text-green-600">$8,420</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Downtime Costs Avoided</span>
                      <span className="text-sm font-medium text-green-600">$15,680</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Emergency Repair Savings</span>
                      <span className="text-sm font-medium text-green-600">$4,230</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium">
                      <span>Total Quarterly Savings</span>
                      <span className="text-green-600">$28,330</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Overall Equipment Effectiveness</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Predictive Accuracy</span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Maintenance Compliance</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
