import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <ul className='menu menu-horizontal border-b-2 w-full border-b-gray-500'>
        <li>
          <Link to='/main' className='[&.active]:text-accent'>
            Main
          </Link>
        </li>
        <li>
          <Link to='/sse' className='[&.active]:text-accent'>
            SSE
          </Link>
        </li>
        <li>
          <Link to='/about' className='[&.active]:text-accent'>
            About
          </Link>
        </li>
      </ul>
      <div className='p-4'>
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  )
})
