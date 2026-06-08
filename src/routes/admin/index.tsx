import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    // Redireciona o acesso a /admin diretamente para servidores
    throw redirect({
      to: '/admin/servidores',
    })
  },
})
