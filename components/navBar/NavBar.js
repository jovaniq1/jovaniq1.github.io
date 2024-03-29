/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Image, Icon } from 'semantic-ui-react';
import React, { useState, Fragment, memo, useContext } from 'react';
import { userContext } from '../../context/userContext';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const notUser = {
  name: 'name',
  email: 'name@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const loginNavigationCustomer = [
  { name: 'Home', href: '/', current: false },
  { name: 'Appointments', href: '/appointments', current: false },
  { name: 'Calendar', href: '/calendar', current: false },
];
const loginNavigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Team', href: '/team', current: false },
  { name: 'Appointments', href: '/appointments', current: false },
  { name: 'Calendar', href: '/calendar', current: false },
  { name: 'Reports', href: '/reports', current: false },
];
const notLoginNavigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'About', href: '#', current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '/login', onClick: 'signOut' },
];
const notUserNavigation = [
  { name: 'Sign in', href: '/login' },
  { name: 'Create account', href: '/signup' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const NavBar = () => {
  const [openTab, setOpenTab] = useState('');
  const userCtx = useContext(userContext);
  const { isSignIn, setUserIsSignIn, user, setTokenData } = userCtx;
  console.log('---user', user);
  const setActiveTab = (name) => {
    setOpenTab(name);
  };
  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('appointments');
    localStorage.removeItem('webId');
    localStorage.removeItem('staff');
    localStorage.removeItem('customers');
    localStorage.removeItem('website');
    localStorage.removeItem('services');
    setUserIsSignIn(false);
    setTokenData('');
  };

  return (
    <div className="min-h-full ">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon
                      size="big"
                      className="text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                      name="book"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {isSignIn
                        ? user.role === 'customer'
                          ? loginNavigationCustomer.map((item) => (
                              <Link href={item.href} key={item.name}>
                                <a
                                  onClick={() => setOpenTab(item.name)}
                                  href={item.href}
                                  className={classNames(
                                    item.name === openTab
                                      ? 'bg-gray-900 text-white'
                                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'px-3 py-2 rounded-md text-sm font-medium'
                                  )}
                                  aria-current={
                                    item.name === openTab ? 'page' : undefined
                                  }
                                >
                                  {item.name}
                                </a>
                              </Link>
                            ))
                          : loginNavigation.map((item) => (
                              <Link href={item.href} key={item.name}>
                                <a
                                  onClick={() => setOpenTab(item.name)}
                                  href={item.href}
                                  className={classNames(
                                    item.name === openTab
                                      ? 'bg-gray-900 text-white'
                                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'px-3 py-2 rounded-md text-sm font-medium'
                                  )}
                                  aria-current={
                                    item.name === openTab ? 'page' : undefined
                                  }
                                >
                                  {item.name}
                                </a>
                              </Link>
                            ))
                        : notLoginNavigation.map((item) => (
                            <Link href={item.href} key={item.name}>
                              <a
                                onClick={() => setActiveTab(item.name)}
                                href={item.href}
                                className={classNames(
                                  item.name === openTab
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                  'px-3 py-2 rounded-md text-sm font-medium'
                                )}
                                aria-current={
                                  item.name === openTab ? 'page' : undefined
                                }
                              >
                                {item.name}
                              </a>
                            </Link>
                          ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {!isSignIn &&
                      notUserNavigation.map((item) => (
                        <Link href={item.href} key={item.name}>
                          <a
                            onClick={
                              item.onClick === 'signOut' ? signOut : null
                            }
                            href={item.href}
                            className={classNames(
                              item.name === openTab
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={
                              item.name === openTab ? 'page' : undefined
                            }
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}

                    <button
                      type="button"
                      className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <Icon
                        name="bell"
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={isSignIn ? user.imageUrl : notUser.imageUrl}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {isSignIn
                            ? userNavigation.map((item) => (
                                <Link href={item.href} key={item.name} passHref>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href={item.href}
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                        onClick={
                                          item.onClick === 'signOut'
                                            ? signOut
                                            : () => setOpenTab(item.name)
                                        }
                                      >
                                        {item.name}
                                      </a>
                                    )}
                                  </Menu.Item>
                                </Link>
                              ))
                            : notUserNavigation.map((item) => (
                                <Link href={item.href} key={item.name} passHref>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href={item.href}
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                        onClick={() => setOpenTab(item.name)}
                                      >
                                        {item.name}
                                      </a>
                                    )}
                                  </Menu.Item>
                                </Link>
                              ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <Icon
                        name="close"
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <Icon
                        name="list"
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {isSignIn
                  ? loginNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={item.onClick === 'signOut' ? signOut : null}
                        className={classNames(
                          item.name === openTab
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block px-3 py-2 rounded-md text-base font-medium'
                        )}
                        aria-current={
                          item.name === openTab ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))
                  : notUserNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={item.onClick === 'signOut' ? signOut : null}
                        className={classNames(
                          item.name === openTab
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block px-3 py-2 rounded-md text-base font-medium'
                        )}
                        aria-current={
                          item.name === openTab ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={isSignIn ? user.imageUrl : notUser.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {isSignIn ? user.name : notUser.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {isSignIn ? user.email : notUser.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <Icon
                      name="circle thin"
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {notLoginNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      onClick={item.onClick === 'signOut' ? signOut : null}
                      as="a"
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
export default memo(NavBar);
// <header className="bg-white shadow">
// <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//   <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
// </div>
// </header>
// <main>
// <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//   {/* Replace with your content */}
//   <div className="px-4 py-6 sm:px-0">
//     <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
//   </div>
//   {/* /End replace */}
// </div>
// </main>
