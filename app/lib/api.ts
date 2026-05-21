const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  tags: {
    getAll: () => fetch(`${BASE_URL}/api/tags`).then(r => r.json()),
  },
  users: {
    getAll:  () => fetch(`${BASE_URL}/api/users`).then(r => r.json()),
    getById: (id: string) => fetch(`${BASE_URL}/api/users/${id}`, { cache: "no-store" }).then(r => r.json()),
    updateRole: (id: string, role: string) =>
      fetch(`${BASE_URL}/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      }).then(r => r.json()),
  },
    posts: {
      getAll: () => fetch(`${BASE_URL}/api/posts`).then(r => r.json()),
      getById: (id: string) => fetch(`${BASE_URL}/api/posts/${id}`).then(r => r.json()),
    
    },
    categories :{
        getAll:()=> fetch(`${BASE_URL}/api/categories `).then(r => r.json()),
        
        
    }
};