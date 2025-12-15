import { useState } from 'react';
import { Save, Bell, Shield, Database, Palette } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    attendanceWarnings: true,
    weeklyReports: false,
    emailNotifications: true,
  });

  const [thresholds, setThresholds] = useState({
    highRisk: '60',
    mediumRisk: '30',
    lowAttendance: '70',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <Layout title="Settings" subtitle="Configure your dashboard preferences">
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Thresholds
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Model
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Display
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <div className="stat-card max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Notification Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">High Risk Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a student enters high risk category
                  </p>
                </div>
                <Switch
                  checked={notifications.highRiskAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, highRiskAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Attendance Warnings</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when attendance drops below threshold
                  </p>
                </div>
                <Switch
                  checked={notifications.attendanceWarnings}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, attendanceWarnings: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summary of class performance
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts to your email address
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thresholds">
          <div className="stat-card max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Risk Thresholds</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="high-risk">High Risk Threshold (%)</Label>
                <Input
                  id="high-risk"
                  type="number"
                  value={thresholds.highRisk}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, highRisk: e.target.value }))
                  }
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Students with risk probability above this are marked as High Risk
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium-risk">Medium Risk Threshold (%)</Label>
                <Input
                  id="medium-risk"
                  type="number"
                  value={thresholds.mediumRisk}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, mediumRisk: e.target.value }))
                  }
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Students with risk probability above this are marked as Medium Risk
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="low-attendance">Low Attendance Warning (%)</Label>
                <Input
                  id="low-attendance"
                  type="number"
                  value={thresholds.lowAttendance}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, lowAttendance: e.target.value }))
                  }
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Alert when student attendance falls below this percentage
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="model">
          <div className="stat-card max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">ML Model Configuration</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Model Type</Label>
                <Select defaultValue="random-forest">
                  <SelectTrigger className="max-w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random-forest">Random Forest Classifier</SelectItem>
                    <SelectItem value="logistic">Logistic Regression</SelectItem>
                    <SelectItem value="gradient-boost">Gradient Boosting</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Algorithm used for risk prediction
                </p>
              </div>
              <div className="space-y-2">
                <Label>Retraining Frequency</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger className="max-w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  How often the model should be retrained with new data
                </p>
              </div>
              <div className="space-y-2">
                <Label>Training Data Split</Label>
                <Select defaultValue="80-20">
                  <SelectTrigger className="max-w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="70-30">70% Train / 30% Test</SelectItem>
                    <SelectItem value="80-20">80% Train / 20% Test</SelectItem>
                    <SelectItem value="90-10">90% Train / 10% Test</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Data split ratio for model training and validation
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="display">
          <div className="stat-card max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Display Preferences</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Default Dashboard View</Label>
                <Select defaultValue="overview">
                  <SelectTrigger className="max-w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview Dashboard</SelectItem>
                    <SelectItem value="students">Student List</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Students Per Page</Label>
                <Select defaultValue="10">
                  <SelectTrigger className="max-w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 students</SelectItem>
                    <SelectItem value="25">25 students</SelectItem>
                    <SelectItem value="50">50 students</SelectItem>
                    <SelectItem value="100">100 students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chart Animation</Label>
                <Select defaultValue="enabled">
                  <SelectTrigger className="max-w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </Layout>
  );
}
