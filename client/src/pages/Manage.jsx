import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiSolidUser } from 'react-icons/bi'
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

import { DatePicker } from 'antd';
import moment from 'moment'

const { RangePicker } = DatePicker

export default function Manage() {
    const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [amountUser, setAmountUser] = useState(0)
    const [formData, setFormData] = useState(false);
    const [dateRange, setDateRange] = useState([]);
    const [dates, setDates] = useState([])

    console.log(dates)

    useEffect(() => {
        // Thực hiện một HTTP request để lấy danh sách người dùng từ server
        fetch('/api/user/get-user')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));
    }, []);

    // const handleCreateUser = () => {
    //     setShowCreateUserForm(true)
    // }

    useEffect(() => {
        fetch('/api/user/amount-user')
            .then((response) => response.json())
            .then((data) => {
                setAmountUser(data);
                console.log('Data from API:', data);
            })
            .catch((error) => console.error(error));
    }, []); // Thêm [] để đảm bảo useEffect chỉ chạy một lần sau khi component mount

    const handleClickProfile = async (userId) => {
        try {
            const response = await fetch(`/api/user/profile-detail/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Kiểm tra status code
            if (!response.ok) {
                console.error(`Request failed with status: ${response.status}`);
                return;
            }

            // Lấy dữ liệu từ response
            const { success, message, data } = await response.json();

            if (!success) {
                console.error(`API Error: ${message}`);
                return;
            }

            // Chuyển hướng sang trang ProfileDetail với thông tin người dùng
            navigate(`/`);
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };

    return (
        <div className="flex mx-auto mt-16 justify-between gap-4">
            <div className=' w-1/6 sm:inline border-r-2'>
                <div className='fixed flex flex-col ml-5 text-left w-44 justify-center gap-2 transition duration-300 mt-12'>
                    <span className=' flex-row gap-2 w-44 text-md font-semibold md:flex items-center p-2 rounded-lg hover:bg-slate-300 hover:text-slate-900 transition duration-500 cursor-pointer'>
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

            <div className="text-center w-5/6 mt-5 flex justify-center">
                <div className='text-center mt-2 w-full'>
                    <h1 className='font-semibold flex p-3 text-2xl font-sans'>Overview</h1>

                    <div className='flex items-center ml-5'>
                        <h2 className='flex float-left font-semibold text-lg text-slate-500'>Filter by:</h2>
                        <RangePicker className='flex ml-8 p-2 rounded-lg hover:border-violet-500 duration-500'
                            onChange={(values) => {
                                setDates(values.map(item => {
                                    return moment(item).format('DD-MM-YYYY')
                                }))
                            }}
                        />
                    </div>
                    <div className='flex flex-row p-4 h-1/5 gap-4 mb-2 mt-6'>

                        <div className='w-1/5 h-full bg-violet-600 text-white shadow-2xl flex rounded-2xl hover:bg-violet-800 duration-500 flex-col'>
                            <span className='flex font-sans font-semibold ml-3 mt-2 float-left'>
                                <BiSolidUser className='mr-2 flex justify-center items-center my-auto' />
                                User Amount
                            </span>
                            <span className=' flex font-semibold font-sans text-4xl float-left ml-10 mt-2'>{amountUser.totalUsers}</span>
                        </div>
                        <div className='w-1/5 h-full bg-violet-600 text-white shadow-2xl flex rounded-2xl hover:bg-violet-800 duration-500 flex-col'>
                            <span className='flex font-sans font-semibold ml-3 mt-2 float-left'>
                                <BiSolidUser className='mr-2 flex justify-center items-center my-auto' />
                                Current User
                            </span>
                            <span className=' flex font-semibold font-sans text-4xl float-left ml-10 mt-2'>{amountUser.totalUsers}</span>
                        </div>
                        <div className='w-1/5 h-full bg-violet-600 text-white shadow-2xl flex rounded-2xl hover:bg-violet-800 duration-500'>
                            <span className='flex font-sans font-semibold m-3 float-left'>Attandance Amount</span>
                        </div>
                    </div>
                    <div className=' m-2'>
                        <h1 className='flex mt-1'></h1>
                        <div className='border-1 border-slate-300 rounded-lg my-3 p-3 text-lg font-bold mr-2 sm:flex sm:items-center sm:justify-between sm:gap-2'>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>Username</p>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>Email</p>
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='text-center sm:text-left'>Role</p>
                            </div>
                            <div>
                                <p className="text-slate-800 md:my-0 my-7 pl-2 pr-2 text-center duration-500">
                                    Detail
                                </p>
                            </div>
                        </div>
                        {users.map((user) => (
                            <div className='bg-slate-300 rounded bg-opacity-30 my-3 p-3 mr-2 sm:flex font-light text-md sm:items-center sm:justify-between sm:gap-2'>
                                <div className='sm:w-1/3 flex flex-row items-center gap-4 ml-24 '>
                                    <FaUserCircle className='flex text-violet-600 w-6 h-6 shadow-xl' />
                                    <p className='text-center sm:text-left'>{user.username}</p>
                                </div>
                                <div className='sm:w-1/3 '>
                                    <p className='text-center sm:text-left'>{user.email}</p>
                                </div>
                                <div className='sm:w-1/3 '>
                                    <p className='text-center sm:text-left'>{user.role}</p>
                                </div>
                                <div>
                                    <Link to={`/profile-detail/${user._id}`} className='self-center text-center'>
                                        <button className='p-2 ml-2 w-8 justify-center rounded-full flex text-center text-white bg-violet-600 hover:bg-violet-900 hover:scale-125 duration-500'>
                                            <IoIosArrowForward />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* <div className="max-w-sm mx-auto text-center mt-5">
                
                <form hidden className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder='username...'
                        value=""
                        className='border p-3 rounded-lg'
                        id='username'

                    />
                    <input
                        type="email"
                        placeholder='email...'
                        value=""
                        className='border p-3 rounded-lg'
                        id='email'

                    />
                    <input
                        type="password"
                        placeholder='password...'
                        value=""
                        className='border p-3 rounded-lg'
                        id='password'

                    />
                    <button

                        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:shadow-lg hover:bg-slate-800 disabled:opacity-70'>

                    </button>
                </form>
            </div> */}
        </div>
    );
}
