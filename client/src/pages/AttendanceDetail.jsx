import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AiOutlineSetting } from 'react-icons/ai'
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import { useParams } from 'react-router-dom';


export default function AttendanceDetail() {
    const [formData, setFormData] = useState({})
    const { currentUser } = useSelector(state => state.user);
    const [error, setError] = useState(null)
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    console.log("Check: ", currentUser)
    const { userId } = useParams();
    console.log("Check id: ", userId)

    useEffect(() => {
        const fetchUserData = async () => {
            // Kiểm tra xem userId có giá trị không
            if (!userId) {
                console.error('Invalid userId');
                return;
            }

            try {
                const response = await fetch(`/api/user/attendance-detail/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    console.error(data.message || 'User not found');
                    return;
                }

                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [userId]);

    return (
        <Fragment>
            <div className="max-w-sm mx-auto mt-32 z-50"></div >
            <div className='w-1/6 float-left mt-2 ml-2 flex' >
                <button className="bg-gray-700 w-1/2 py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate('/manage')}>
                    Go Back
                </button>
            </ div>
            <div className=' w-1/6 sm:inline border-r-2'>
                <div className='fixed flex flex-col ml-2 text-left w-44 justify-center gap-2 transition duration-300 mt-12'>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold  md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <LuLayoutDashboard />
                        <Link to="/manage" className='self-center'>
                            {currentUser && currentUser.role === 'admin' && (
                                <p className='hidden sm:flex'>
                                    Dashboard
                                </p>
                            )}
                        </Link>
                    </span>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold bg-slate-300 md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <HiOutlineDocumentReport />
                        <Link to="/report" className='self-center'>
                            {currentUser && currentUser.role === 'admin' && (
                                <p className='hidden sm:flex'>
                                    Report
                                </p>
                            )}
                        </Link>
                    </span>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <AiOutlineSetting />
                        <p className='hidden sm:flex'>
                            Setting
                        </p>
                    </span>
                    <span className='flex-row gap-2 w-44 text-md font-semibold md:flex items-center p-2 text-center rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
                        <IoIosAddCircleOutline />
                        <Link to="/create-user" className='self-center'>
                            {currentUser && currentUser.role === 'admin' && (
                                <p className='hidden sm:flex'>
                                    Add Employee
                                </p>
                            )}
                        </Link>
                    </span>
                </div>
            </div>

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

                    <div className='border rounded-lg my-3 p-2 text-sm bg-white ml-2 mr-2 sm:flex sm:items-center sm:justify-between sm:gap-2'>
                        <div className='sm:w-1/3 flex gap-2 floast-left items-center'>
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
                            <p className='text-center sm:text-left'>phonenumber</p>
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
                </div>
            </form>
        </Fragment >
    )
}
