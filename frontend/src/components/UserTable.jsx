import React from 'react';

export default function UserTable({ users = [] }) {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg max-w-5xl mx-auto bg-white">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Role</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                No users found.
              </td>
            </tr>
          )}
          {users.map(({ id, username, email, role }) => (
            <tr
              key={id}
              className="bg-white border-b hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4">{id}</td>
              <td className="px-6 py-4">{username}</td>
              <td className="px-6 py-4">{email}</td>
              <td className="px-6 py-4">{role}</td>
              <td className="px-6 py-4 space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
