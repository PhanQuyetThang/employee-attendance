import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

export default function EmployeeRoute() {
    const { currentUser } = useSelector(state => state.user)

    if (currentUser && currentUser.role === 'employee') {
        return <Outlet />;
    } else {
        // Nếu người dùng không đủ quyền, trả về trang thông báo
        return <Navigate to="/" state={{ message: "Bạn không đủ quyền để truy cập chức năng này!" }} />;
    }
}
