import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Maintenance Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            African Maintenance
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Revolutionizing industrial maintenance with AI-powered detection for machines across African industries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Button size="lg" className="text-lg px-8 py-3" href="/">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3" href="/learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose African Maintenance?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI-powered platform delivers unparalleled accuracy in machine fault detection, tailored for African industrial environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI-Powered Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced machine learning algorithms analyze vibration, temperature, and acoustic data to predict maintenance needs before failures occur.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏭</span>
                Industry Optimized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Specifically designed for African manufacturing, mining, and processing industries with local environmental considerations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Real-Time Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Continuous monitoring with instant alerts and predictive analytics to minimize downtime and maximize productivity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Cost Effective
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Reduce maintenance costs by up to 40% through predictive maintenance and optimized resource allocation.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                Local Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Deep understanding of African industrial challenges with solutions adapted to local power, connectivity, and operational realities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Data-Driven Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive dashboards and reporting tools provide actionable insights for better decision-making and operational efficiency.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, powerful, and effective maintenance prediction in three easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Install Sensors</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deploy our IoT sensors on your machinery to collect real-time data on vibration, temperature, and performance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI algorithms continuously analyze the data to detect anomalies and predict potential failures before they occur.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Action</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive alerts and recommendations through our dashboard, allowing you to schedule maintenance proactively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Maintenance Strategy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading African industries in adopting AI-powered predictive maintenance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-green-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">African Maintenance</h3>
              <p className="text-gray-400">
                AI-powered predictive maintenance solutions for African industries.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Manufacturing</li>
                <li>Mining</li>
                <li>Processing</li>
                <li>Energy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>API Reference</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-gray-400">
            <p>&copy; 2025 African Maintenance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
