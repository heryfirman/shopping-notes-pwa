import { ReactNode } from "react"

type Props = {
    children: ReactNode;
};

function Layout({children}: Props) {
  return (
    <div className="max-w-xl h-full mx-auto p-4">{children}</div>
  )
}

export default Layout