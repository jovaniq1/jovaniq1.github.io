import React, { useState, useContext } from 'react';
import 'fomantic-ui-css/semantic.css';
import { useRouter } from 'next/router';
import { userContext } from '../../context/userContext';
import {
  registerUser,
  createWebsite,
  getCustomers,
} from '../fetching/PostsWithAxios';
import { InvalidInput } from '../errors/errors';

const SignUpForm = ({ user }) => {
  const [userType, setUserType] = useState('');
  const [image, setImages] = useState();
  const [errors, setErrors] = useState([]);
  const router = useRouter();
  const userCtx = useContext(userContext);
  const { setUserIsSignIn } = userCtx;
  const onChangeImage = async (e) => {
    const file = e.target.files[0];
    console.log('file', file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstname: e.target.firstname.value,
      lastname: e.target.lastname.value,
      email: e.target.email.value,
      username: e.target.username.value,
      password: e.target.password.value,
      passconfirm: e.target.passconfirm.value,
      role: e.target.role.value,
      phone: e.target.phone.value,
    };
    if (!user) {
      if (user === 'New Customer') data.role = 'customer';
      if (user === 'New Staff') data.role = 'staff';
    }
    console.log('data', data);
    if (data.role === 'admin') {
      data.domain = e.target.domain.value;
      data.about = e.target.about.value;
      data.webname = e.target.webname.value;
      data.imageUrl = image;
    }

    const graphqlQuery = {
      query: `
      mutation {
        createUser( userInput:{username:"${data?.username}",email:"${data?.email}",firstname:"${data?.firstname}",lastname:"${data?.lastname}",
        password:"${data?.password}",phone:"${data?.phone}", role:"${data?.role}"}) {
          userId
          token
        }
      }
      `,
    };
    const registerData = await registerUser(graphqlQuery);
    if (registerData.errors) {
      setErrors(registerData.errors);
      console.log('registerData.errors', registerData.errors);
    }
    //fetch staff and customers
    const queryCustomers = {
      graphqlQuery: {
        query: `
        query {
          getCustomers{
      
            totalCustomers
              customers{
                  _id
                  firstname
                  lastname
              }
              staff{
                  _id
                  firstname
                  lastname
              }
              totalStaff
         }
        }
        `,
      },
      token,
    };
    const customersData = await getCustomers(queryCustomers);
    if (customersData) {
      setCustomerData(customersData.data.getCustomers.customers);
      setStaffData(customersData.data.getCustomers.staff);
      localStorage.setItem(
        'customers',
        JSON.stringify(customersData.data.getCustomers.customers)
      );
      localStorage.setItem(
        'staff',
        JSON.stringify(customersData.data.getCustomers.staff)
      );
    }

    const token = registerData?.data?.createUser.token;
    console.log(token);
    if (token && data?.role === 'admin') {
      setUserIsSignIn(true);
      localStorage.setItem('token', JSON.stringify(token));
      router.push('/');
    }

    // const token = registerData?.data?.register?.token;
    // if (token) {
    //   setUserIsSignIn(true);
    //   localStorage.setItem('token', JSON.stringify(token));
    //   // const createWebQuery = {
    //   //   query: `
    //   //   mutation {
    //   //     createWebsite(website:{
    //   //       name:"${data.webname}",
    //   //       domain:"${data.domain}",
    //   //       imageUrl:"${data.imageUrl}"
    //   //       visits:${1} }) {
    //   //       name
    //   //     }
    //   //   }
    //   //   `,
    //   // };
    //   // const queryData = { createWebQuery, token };
    //   // const websiteData = await createWebsite(queryData);
    //   // console.log(websiteData);
    // }
  };

  // const nextBtnClick = () => {
  //   setNextClick(nextClick + 1);
  //   if (nextClick >= 2) {
  //     setNextClick(2);
  //   }
  // };
  // const backBtnClick = () => {
  //   setNextClick(nextClick - 1);
  //   if (nextClick <= 0) {
  //     setNextClick(0);
  //   }
  // };

  //setUserType

  if (user === 'New Customer') {
    console.log('user', user);
  }

  return (
    <>
      {errors
        ? errors.map((err) => (
            <InvalidInput key={err} msg={err} setErrors={setErrors} />
          ))
        : null}
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>
      <div>
        <form
          action="/api/graphql"
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
        >
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Use a permanent address where you can receive mail.
                  </p>
                </div>
              </div>

              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          id="first-name"
                          autoComplete="given-name"
                          className="border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          id="last-name"
                          autoComplete="family-name"
                          className="border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <input
                          type="phone"
                          name="phone"
                          id="phone"
                          autoComplete="family-name"
                          className="border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <input
                          type="text"
                          name="email"
                          id="email-address"
                          autoComplete="email"
                          className="border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                        />
                      </div>

                      {/* <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 lg:text-lg"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div> */}

                      {/* <div className="col-span-6">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street address
                      </label>
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        className=" border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                      />
                    </div> */}
                      {/* 
                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className=" border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                      />
                    </div> */}

                      {/* <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        className=" border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                      />
                    </div> */}

                      {/* <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        className=" border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                      />
                    </div> */}
                    </div>
                  </div>
                  {/* <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Create your account
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    safely secure your credentials.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="given-name"
                          className="border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          autoComplete="family-name"
                          className="border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm password
                        </label>
                        <input
                          type="password"
                          name="passconfirm"
                          id="confirm-password"
                          autoComplete="family-name"
                          className="border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm lg:text-lg border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 relative">
                        <label
                          htmlFor="user-type"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Account type
                        </label>
                        {user ? (
                          <label className="block text-lg font-medium text-gray-900 border-y-2  border border-2">
                            {user === 'New Customer' ? 'Customer' : 'Staff'}
                          </label>
                        ) : (
                          <select
                            id="user-type"
                            onChange={(e) => setUserType(e.target.value)}
                            value={userType}
                            name="role"
                            autoComplete="user-type"
                            className=" select-auto mt-1 block  border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
                          >
                            <option>customer</option>
                            <option>staff</option>
                            <option>admin</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {userType === 'admin' && (
            <div>
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Website information
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Website
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              http://
                            </span>
                            <input
                              type="text"
                              name="domain"
                              id="company-website"
                              className=" border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none  lg:text-lg border-gray-300"
                              placeholder="domain"
                            />
                            <span className="inline-flex items-center px-3 border border-l-0 rounded-r-md border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              .weebapp.com
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <label
                            htmlFor="webname"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Website Name:
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="text"
                              name="webname"
                              id="webname"
                              className=" border focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none  lg:text-lg border-gray-300"
                              placeholder="Joe's Cleaning Services"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="about"
                          className="block text-sm font-medium text-gray-700"
                        >
                          About
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full lg:text-lg border border-gray-300 rounded-md"
                            placeholder="you@example.com"
                            defaultValue=""
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description for your profile. URLs are
                          hyperlinked.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Photo
                        </label>
                        <div className="mt-1 flex items-center">
                          <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                            <svg
                              className="h-full w-full text-gray-300"
                              fill="currentColor"
                              id="photo"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                          <button
                            type="button"
                            className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cover photo
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="image"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="image"
                                  name="image"
                                  onChange={onChangeImage}
                                  type="file"
                                  className="sr-only"
                                />
                                {/* <ImageUpload /> */}
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                  <div className="border-t border-gray-200" />
                </div>
              </div>

              <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Notifications
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Decide which communications you&apos;d like to receive
                        and how.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="shadow overflow-hidden sm:rounded-md">
                      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                        <fieldset>
                          <legend className="sr-only">By Email</legend>
                          <div
                            className="text-base font-medium text-gray-900"
                            aria-hidden="true"
                          >
                            By Email
                          </div>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="comments"
                                  name="comments"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="comments"
                                  className="font-medium text-gray-700"
                                >
                                  Comments
                                </label>
                                <p className="text-gray-500">
                                  Get notified when someones posts a comment on
                                  a posting.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="candidates"
                                  name="candidates"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="candidates"
                                  className="font-medium text-gray-700"
                                >
                                  Candidates
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate applies for a
                                  job.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="offers"
                                  name="offers"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="offers"
                                  className="font-medium text-gray-700"
                                >
                                  Offers
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate accepts or
                                  rejects an offer.
                                </p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                        <fieldset>
                          <legend className="contents text-base font-medium text-gray-900">
                            Push Notifications
                          </legend>
                          <p className="text-sm text-gray-500">
                            These are delivered via SMS to your mobile phone.
                          </p>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-center">
                              <input
                                id="push-everything"
                                name="push-notifications"
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label
                                htmlFor="push-everything"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Everything
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="push-email"
                                name="push-notifications"
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label
                                htmlFor="push-email"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Same as email
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="push-nothing"
                                name="push-notifications"
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label
                                htmlFor="push-nothing"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                No push notifications
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
export default SignUpForm;
