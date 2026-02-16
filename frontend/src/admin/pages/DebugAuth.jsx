import { useApp } from "../../context/AppContext";

export default function DebugAuth() {
  const { user, authLoading } = useApp();
  
  const localStorageToken = localStorage.getItem("token");
  const localStorageUser = localStorage.getItem("user");
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-lg">Auth Loading:</h2>
          <p className="text-gray-700">{authLoading ? "TRUE (still loading)" : "FALSE (loaded)"}</p>
        </div>
        
        <div>
          <h2 className="font-semibold text-lg">User from Context:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="font-semibold text-lg">Token from localStorage:</h2>
          <p className="bg-gray-100 p-4 rounded break-all">
            {localStorageToken || "NO TOKEN"}
          </p>
        </div>
        
        <div>
          <h2 className="font-semibold text-lg">User from localStorage:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {localStorageUser || "NO USER"}
          </pre>
        </div>
        
        <div>
          <h2 className="font-semibold text-lg">User Role:</h2>
          <p className="text-gray-700">{user?.role || "NO ROLE"}</p>
        </div>
        
        <div>
          <h2 className="font-semibold text-lg">Is Admin:</h2>
          <p className="text-gray-700">
            {user?.role?.toLowerCase() === "admin" ? "YES" : "NO"}
          </p>
        </div>
      </div>
    </div>
  );
}
