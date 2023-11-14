import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, Fragment } from "react"

export default function Report() {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // Thực hiện một HTTP request để lấy danh sách người dùng từ server
        fetch('/api/user/get-user')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await fetch('/api/auth/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data)
            if (data.success === false) {
                setLoading(false)
                setError(data.message)
                return;
            }
            setLoading(false)
            setError(null)
            navigate('/manage')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }
    return (
        <Fragment>
            <div className="max-w-sm mx-auto mt-32 z-50"></div >
            <div className='w-1/6 float-left mt-2 ml-2 flex' >
                <button className="bg-gray-700 w-1/2 py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </ div>

            <form className="flex flex-col w-full">

                <div className='mr-20 ml-20'>

                    <h1 className="text-lg font-semibold text-center text-slate-500">Time and Attendance Detail</h1>
                    <div className='border-1 border-slate-400 rounded-lg my-3 p-3 text-md text-slate-500 font-bold bg-transparent ml-2 mr-2 sm:flex sm:items-center sm:justify-between sm:gap-2'>
                        <div className='sm:w-1/3  border-e-2 border-slate-300 p-2'>
                            <p className='text-center sm:text-left'>Name</p>
                        </div>
                        <div className='sm:w-1/3 border-e-2 border-slate-300 p-2'>
                            <p className='text-center sm:text-left'>Department</p>
                        </div>
                        <div className='sm:w-1/3 border-e-2 border-slate-300 p-2'>
                            <p className='text-center sm:text-left'>Date</p>
                        </div>
                        <div className='sm:w-1/3 border-e-2 border-slate-300 p-2'>
                            <p className='text-center sm:text-left'>Clock-in</p>
                        </div>
                        <div className='sm:w-1/3 border-e-2 border-slate-300 p-2'>
                            <p className='text-center sm:text-left'>Clock-out</p>
                        </div>
                        <div className='sm:w-1/3 border-e-2 border-slate-300 p-2'>
                            <p className='text-center sm:text-left'>Worktime</p>
                        </div>
                        <div className='sm:w-1/3'>
                            <p className='text-center sm:text-left'>All Activities</p>
                        </div>
                        {/* <div>
                            <p className="text-slate-800 md:my-0 my-7 pl-2 pr-2 text-center duration-500">
                                Detail
                            </p>
                        </div> */}
                    </div>

                    {users.map((user) => (
                        <div className='border rounded-lg my-3 p-2 text-sm bg-white ml-2 mr-2 sm:flex sm:items-center sm:justify-between sm:gap-2'>
                            <div className='sm:w-1/3 flex gap-2 floast-left items-center'>
                                <Link to={`/attendance-detail`} className='flex flex-row items-center gap-2'>
                                    <img src={user.avatar} className='rounded-full h-10' alt="" />
                                    <p className='text-center sm:text-left'>{user.username}</p>
                                </Link>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>unknown</p>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>unknown</p>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>unknown</p>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>{user.phonenumber}</p>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>unknown</p>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>unknown</p>
                            </div>
                            {/* <div>
                                <Link to={`/profile-detail/${user._id}`} className='self-center text-center'>
                                    <button className='p-2 bg-gray-200 ml-2 rounded flex text-center hover:bg-slate-300 duration-500'>
                                        <p className="text-slate-800 md:my-0 my-7 pl-2 pr-2 text-center duration-500">
                                            Detail
                                        </p>
                                    </button>
                                </Link>
                            </div> */}
                        </div>
                    ))}
                </div>
            </form>
        </Fragment >
    )
}
