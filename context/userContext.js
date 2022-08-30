import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import {
  updateAppointment,
  getWebsite,
  getAppointments,
} from '../components/fetching/PostsWithAxios';
export const userContext = createContext({
  company: {},
  appointmentsData: [],
  isSignIn: false,
  appointments: [],
  customers: [],
  staff: [],
  website: [],
  services: [],
  token: '',
  domain: '',
  user: {},
  toggleCancel: (_id) => {},
  toggleApprove: (_id) => {},
  fetchAppointments: async () => {},
  setGetWebsiteData: async (data) => {},
  forceUpdate: () => {},
  setTokenData: (data) => {},
  setUserData: (data) => {},
  setStaffData: (data) => {},
  setCustomerData: (data) => {},
  setUserIsSignIn: (data) => {},
});

const UserContextProvider = ({ children }) => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [website, setWebsite] = useState([]);
  const [domain, setDomain] = useState('');
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [, updateState] = useState();
  const router = useRouter();
  // fetch website info

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    const localAppointments = localStorage.getItem('appointments');
    const localUser = localStorage.getItem('user');
    // const customers = localStorage.getItem('customers');
    // const staff = localStorage.getItem('staff');
    // const services = localStorage.getItem('services');
    let isToken, isAppointments, isCustomers, isStaff, isUser;
    //  API'S

    if (localToken) {
      isToken = JSON.parse(localToken);
      setToken(isToken);
    } else router.push('/login');
    if (localUser) {
      isUser = JSON.parse(localUser);
      setUser(isUser);
    }

    if (localAppointments) {
      isAppointments = JSON.parse(localAppointments);
      let newData = isAppointments.map((appointment) => {
        let start = new Date(appointment.start);
        let end = new Date(appointment.end);
        return { ...appointment, start, end };
      });
      setAppointments(newData);
    }

    if (isToken) {
      setIsSignIn(true);
    }
    //
  }, []);
  const forceUpdate = useCallback(() => updateState({}), []);
  const setTokenData = (data) => setToken(data);

  const setUserIsSignIn = (data) => {
    setIsSignIn(data);
  };

  //getWebsite

  const setGetWebsiteData = async (data) => {
    let isToken = token;
    if (!token) {
      isToken = JSON.parse(localStorage.getItem('token'));
    }
    if (!data) {
      data = '';
    }

    const query = {
      token: isToken,
      graphql: {
        query: `query getWebsite($name: String) {
          getWebsite(domain: $name) {
          
            website{
              _id
              name
              domain
              dateCreated
          }
          customers{
            _id
              firstname
              lastname
              email
              phone
          }
          staff{
              _id
              firstname
              lastname
              email
              phone

          }
          services{
            _id
             duration
            cost
            serviceName
            description
        }
         }
      }`,
        variables: {
          name: 'data',
        },
      },
    };
    console.log('query', query);
    const webData = await getWebsite(query);
    console.log('webData', webData);
    localStorage.setItem(
      'services',
      JSON.stringify(webData?.data?.getWebsite?.services)
    );
    localStorage.setItem(
      'customers',
      JSON.stringify(webData?.data?.getWebsite?.customers)
    );
    localStorage.setItem(
      'website',
      JSON.stringify(webData?.data?.getWebsite?.website)
    );
    localStorage.setItem(
      'staff',
      JSON.stringify(webData?.data?.getWebsite?.staff)
    );
    setStaff(webData?.data?.getWebsite?.staff);
    setWebsite(webData?.data?.getWebsite?.website);
    setCustomers(webData?.data?.getWebsite?.customers);
    setServices(webData?.data?.getWebsite?.services);
  };

  //fetch appointments
  const fetchAppointments = useCallback(async () => {
    let page = 10;
    let isToken = token;
    if (!token) {
      isToken = JSON.parse(localStorage.getItem('token'));
    }
    const queryAppointments = {
      token: isToken,
      graphql: {
        query: `query appointments($page: Int!) {
            appointments(page: $page) {
              appointments {
                _id
                status
                start
                end
                completed
                customer{
                    firstname
                    lastname
                }
                staff{
                    firstname
                    lastname
                }
                service{
                  _id
                  serviceName
                  cost
                  duration
              }
              }
              totalAppointments
                  }
          }`,
        variables: {
          page,
        },
      },
    };

    const appointmentsData = await getAppointments(queryAppointments);
    if (appointmentsData.data) {
      let appt = appointmentsData.data.appointments.appointments;
      let newData = appt.map((appointment) => {
        let start = new Date(appointment.start);
        let end = new Date(appointment.end);
        return { ...appointment, start, end };
      });
      setAppointments(newData);
      localStorage.setItem('appointments', JSON.stringify(newData));
    }
  }, [website, token]);

  const setWebsiteData = (data) => {
    setWebsite(data);
  };
  const setUserData = (data) => {
    setUser(data);
  };
  const setCustomerData = (data) => {
    setCustomers(data);
  };
  const setStaffData = (data) => {
    setStaff(data);
  };
  const toggleCancel = useCallback(
    async (_id) => {
      // let appointment = appointments.find((appt) => appt._id === _id);
      let index = appointments.findIndex((appt) => appt._id === _id);
      let status = 'cancel';
      console.log('test cancel toggle', _id);
      let isToken = token;
      if (!token) {
        isToken = JSON.parse(localStorage.getItem('token'));
      }
      const queryAppt = {
        token: isToken,
        graphql: {
          query: `mutation updateAppointment($appointmentId: ID!, $status: String!) {
            updateAppointment(id: $appointmentId, AppointmentInput:{status: $status}) {
              _id
              status
              start
              end
              completed
              customer{
                  firstname
                  lastname
              }
              staff{
                  firstname
                  lastname
              }
              service{
                _id
                serviceName
                cost
                duration
            }
           }
        }`,
          variables: {
            appointmentId: _id,
            status,
          },
        },
      };
      const isUpdated = await updateAppointment(queryAppt);
      if (isUpdated?.errors) {
        return isUpdated;
      }

      await fetchAppointments();
      // let updatedAppointment = isUpdated?.data?.updateAppointment;
      // let start = new Date(updatedAppointment?.start);
      // let end = new Date(updatedAppointment?.end);
      // console.log('isUpdated', updatedAppointment);
      // appointments[index] = {
      //   ...updatedAppointment,
      //   start,
      //   end,
      // };
      // setAppointments(appointments);
      // localStorage.setItem('appointments', JSON.stringify(appointments));
      return isUpdated;
    },
    [appointments, token, fetchAppointments]
  );
  const toggleApprove = useCallback(
    async (_id) => {
      // let appointment = appointments.find((appt) => appt._id === _id);
      let index = appointments.findIndex((appt) => appt._id === _id);
      let status = 'approve';
      let isToken = token;
      if (!token) {
        isToken = JSON.parse(localStorage.getItem('token'));
      }
      const queryAppt = {
        token: isToken,
        graphql: {
          query: `mutation updateAppointment($appointmentId: ID!, $status: String!) {
            updateAppointment(id: $appointmentId, AppointmentInput:{status: $status}) {
              _id
              status
              start
              end
              completed
              customer{
                  firstname
                  lastname
              }
              staff{
                  firstname
                  lastname
              }
              service{
                _id
                serviceName
                cost
                duration
            }
           }
        }`,
          variables: {
            appointmentId: _id,
            status,
          },
        },
      };
      const isUpdated = await updateAppointment(queryAppt);
      if (isUpdated?.errors) {
        return isUpdated;
      }

      await fetchAppointments();
      // let updatedAppointment = isUpdated?.data?.updateAppointment;
      // let start = new Date(updatedAppointment?.start);
      // let end = new Date(updatedAppointment?.end);
      // console.log('isUpdated', updatedAppointment);
      // appointments[index] = {
      //   ...updatedAppointment,
      //   start,
      //   end,
      // };
      // setAppointments(appointments);
      // localStorage.setItem('appointments', JSON.stringify(appointments));
      return isUpdated;
    },
    [appointments, token, fetchAppointments]
  );

  const value = useMemo(
    () => ({
      setUserIsSignIn,
      fetchAppointments,
      toggleCancel,
      toggleApprove,
      setCustomerData,
      setStaffData,
      setWebsiteData,
      setTokenData,
      setUserData,
      forceUpdate,
      setGetWebsiteData,
      website,
      appointments,
      customers,
      staff,
      isSignIn,
      user,
      token,
      domain,
      services,
    }),
    [
      fetchAppointments,
      forceUpdate,
      isSignIn,
      token,
      domain,
      services,
      user,
      toggleCancel,
      toggleApprove,
      appointments,
      customers,
      website,
      staff,
    ]
  );

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserContextProvider;
