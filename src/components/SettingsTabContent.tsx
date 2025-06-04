
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import DeleteAccountDialog from '@/components/DeleteAccountDialog';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';

interface SettingsTabContentProps {
  user: any;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input 
              value={user.user_metadata?.full_name || ''} 
              disabled 
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input 
              value={user.email || ''} 
              disabled 
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Member Since</label>
            <Input 
              value={new Date(user.created_at).toLocaleDateString()} 
              disabled 
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account settings and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Security</h4>
            <ChangePasswordDialog />
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h4>
            <p className="text-xs text-gray-500 mb-3">
              This will delete all your account data and sign you out immediately.
            </p>
            <DeleteAccountDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTabContent;
