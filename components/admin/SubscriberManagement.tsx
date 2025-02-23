"use client"

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { generateRandomShortId } from "@/utils/shortId";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  isSubscriber?: boolean;
  subscriptionStartDate?: string;
  subscriptionPeriod?: number;
  shortId?: string;
}

export default function SubscriberManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<number>(12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/regusers");
      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleUserSelect = (value: string) => {
    console.log("Selected user:", value);
    setSelectedUser(value);
  };

  const handleSubscriptionUpdate = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    setLoading(true);
    try {
      const shortId = generateRandomShortId();
      const response = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          subscriptionPeriod,
          shortId,
          subscriptionStartDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update subscription");

      toast.success("Subscription updated successfully");
      fetchUsers(); // Refresh user list
      setSelectedUser("");
    } catch (error) {
      toast.error("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select User</label>
          <Select
            value={selectedUser}
            onValueChange={handleUserSelect}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {`${user.firstName} ${user.lastName} (${user.workEmail})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subscription Period (months)</label>
          <Input
            type="number"
            value={subscriptionPeriod}
            onChange={(e) => setSubscriptionPeriod(Number(e.target.value))}
            min={1}
            className="w-full"
          />
        </div>

        {selectedUser && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Selected User Details:</h3>
            {users.find(u => u._id === selectedUser) && (
              <div className="space-y-1 text-sm">
                <p>Current Status: {users.find(u => u._id === selectedUser)?.isSubscriber ? 'Subscribed' : 'Not Subscribed'}</p>
                {users.find(u => u._id === selectedUser)?.shortId && (
                  <p>ShortID: {users.find(u => u._id === selectedUser)?.shortId}</p>
                )}
                {users.find(u => u._id === selectedUser)?.subscriptionStartDate && (
                  <p>Start Date: {new Date(users.find(u => u._id === selectedUser)?.subscriptionStartDate!).toLocaleDateString()}</p>
                )}
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleSubscriptionUpdate}
          disabled={loading || !selectedUser}
          className="w-full"
        >
          {loading ? "Updating..." : "Update Subscription"}
        </Button>
      </div>
    </Card>
  );
} 