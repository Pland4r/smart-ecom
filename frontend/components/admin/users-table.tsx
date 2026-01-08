"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, UserPlus } from "lucide-react"
import { userService } from "@/lib/services/user.service"
import { UserProfile } from "@/lib/services/auth.service"
import { useAuth } from "@/lib/context/AuthContext"

export function UsersTable() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [editingData, setEditingData] = useState<{role?: string, is_active?: boolean}>({})

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers()
      console.log('Loaded users:', data) // Debug: see what we're getting
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user)
    setEditingData({}) // Reset editing data
  }

  const handleSave = async () => {
    if (!editingUser) return
    
    try {
      if (editingData.role !== undefined || editingData.is_active !== undefined) {
        await userService.updateUser(editingUser.id, editingData)
        // Reload users to get updated data
        await loadUsers()
      }
      setEditingUser(null)
      setEditingData({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id)
        setUsers(users.filter((u) => u.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete user')
      }
    }
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!userId || userId === 'undefined') {
      console.error('Cannot update user: userId is undefined')
      setError('Cannot update user: Invalid user ID')
      return
    }
    
    // Store the change in editingData instead of saving immediately
    setEditingData(prev => ({ ...prev, role: newRole }))
  }

  const handleStatusChange = (userId: string, isActive: boolean) => {
    if (!userId || userId === 'undefined') {
      console.error('Cannot update user: userId is undefined')
      setError('Cannot update user: Invalid user ID')
      return
    }
    
    // Store the change in editingData instead of saving immediately
    setEditingData(prev => ({ ...prev, is_active: isActive }))
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading users...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Username</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id || `user-${index}`} className="border-b border-border">
                      <td className="py-3 px-4 text-card-foreground">{user.username}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        {editingUser?.id === user.id ? (
                          <select
                            value={editingData.role !== undefined ? editingData.role : user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option key="admin" value="admin">Admin</option>
                            <option key="client" value="client">Client</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingUser?.id === user.id ? (
                          <select
                            value={editingData.is_active !== undefined ? (editingData.is_active ? "active" : "inactive") : (user.is_active ? "active" : "inactive")}
                            onChange={(e) => handleStatusChange(user.id, e.target.value === "active")}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option key="active" value="active">Active</option>
                            <option key="inactive" value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingUser?.id === user.id ? (
                            <div key={`edit-${user.id || index}`} className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingUser(null)
                                  setEditingData({})
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={handleSave}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <div key={`actions-${user.id || index}`}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(user)}
                                disabled={user.id === currentUser?.id}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(user.id)}
                                disabled={user.id === currentUser?.id}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}