"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type ModelVersionDto = {
  id: string
  name: string
  type: string
  isActive: boolean
  metrics: Record<string, unknown> | null
  createdAt: string
}

async function fetchModelVersions(): Promise<{ modelVersions: ModelVersionDto[] }> {
  const res = await fetch("/api/admin/models")
  if (!res.ok) throw new Error("Failed to load model versions")
  return res.json()
}

function formatMetricValue(value: unknown): string {
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(4)
  return String(value)
}

export default function AdminModelsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "model-versions"],
    queryFn: fetchModelVersions,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Model Monitoring</h1>
      <p className="mb-8 text-muted-foreground">
        Every metric below is exactly what AfriSwarm_A141_Colab2.ipynb reported — including components that do{" "}
        <strong>not</strong> meet their target and are intentionally not activated. Nothing here is smoothed over.
      </p>

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">Failed to load model versions.</p>}

      <div className="space-y-6">
        {data?.modelVersions.map((mv) => (
          <Card key={mv.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{mv.name}</CardTitle>
                  <CardDescription>{mv.type}</CardDescription>
                </div>
                <Badge variant={mv.isActive ? "default" : "secondary"}>
                  {mv.isActive ? "Active" : "Not deployed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {mv.metrics && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(mv.metrics).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell className="whitespace-normal">{formatMetricValue(value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
