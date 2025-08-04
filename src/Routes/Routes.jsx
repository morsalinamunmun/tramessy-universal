import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home";
import CarList from "../Pages/CarList";
import DriverList from "../Pages/DriverList";
import TripList from "../Pages/TripList";
import Fuel from "../Pages/Fuel";
import FuelForm from "../Pages/FuelForm";
import Parts from "../Pages/Parts";
import Maintenance from "../Pages/Maintenance";
import MaintenanceForm from "../Pages/MaintenanceForm";
import DailyIncome from "../Pages/DailyIncome";
import DailyExpense from "../Pages/DailyExpense";
import AllUsers from "../Pages/AllUsers";
import AddUserForm from "../Pages/AddUserForm";
import Login from "../components/Form/Login";
import ResetPass from "../components/Form/ResetPass";
import PrivateRoute from "./PrivateRoute";

import UpdateUsersForm from "../Pages/updateForm/UpdateUsersForm";

import AdminRoute from "./AdminRoute";
import MonthlyStatement from "../Pages/MonthlyStatement";
import DailyTripExpense from "../Pages/DailyTripExpense";
import Booking from "../Pages/Booking";
import DriverForm from "../Pages/AddDriverForm";
import CarForm from "../Pages/AddCarForm";
import TripForm from "../Pages/AddTripForm";
export const router = createBrowserRouter([
  {
    path: "/tramessy",
    element: <Main />,
    children: [
      {
        path: "/tramessy",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/car-list",
        element: (
          <PrivateRoute>
            <CarList />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/add-carForm",
        element: (
          <PrivateRoute>
            <CarForm mode="add" />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/update-CarForm/:id",
        element: (
          <PrivateRoute>
            <CarForm mode="edit" />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/driver-list",
        element: (
          <PrivateRoute>
            <DriverList />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/add-driverForm",
        element: (
          <PrivateRoute>
            <DriverForm mode="add"/>
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/update-driverForm/:id",
        element: (
          <PrivateRoute>
            <DriverForm mode="edit"/>
          </PrivateRoute>
        ),
 
      },
      {
        path: "/tramessy/trip-list",
        element: (
          <PrivateRoute>
            <TripList />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/add-trip",
        element: (
          <PrivateRoute>
            <TripForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/update-trip/:id",
        element: (
          <PrivateRoute>
            <TripForm isUpdate={true}/>
          </PrivateRoute>
        ),
  
      },
      {
        path: "/tramessy/fuel",
        element: (
          <PrivateRoute>
            <Fuel />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/add-fuel",
        element: (
          <PrivateRoute>
            <FuelForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/update-fuel/:id",
        element: (
          <PrivateRoute>
            <FuelForm isUpdate={true}/>
          </PrivateRoute>
        ),
    
      },
      {
        path: "/tramessy/Parts",
        element: (
          <PrivateRoute>
            <Parts />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/maintenance",
        element: (
          <PrivateRoute>
            <Maintenance />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/add-maintenance",
        element: (
          <PrivateRoute>
            <MaintenanceForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/update-maintenance/:id",
        element: (
          <PrivateRoute>
            <MaintenanceForm isUpdate={true} />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "/tramessy/booking",
      //   element: (
      //     <PrivateRoute>
      //       <Booking />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "/tramessy/add-booking",
      //   element: (
      //     <PrivateRoute>
      //       <AddBookingForm/>
      //     </PrivateRoute>
      //   ),
      // },
      
      {
        path: "/tramessy/daily-income",
        element: (
          <PrivateRoute>
            <DailyIncome />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/daily-trip-expense",
        element: (
          <PrivateRoute>
            <DailyTripExpense />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/daily-expense",
        element: (
          <PrivateRoute>
            <DailyExpense />
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/monthly-statement",
        element: (
          <PrivateRoute>
            <MonthlyStatement/>
          </PrivateRoute>
        ),
      },
      {
        path: "/tramessy/all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "/tramessy/add-userForm",
        element: (
          <AdminRoute>
            <AddUserForm />
          </AdminRoute>
        ),
      },
      {
        path: "/tramessy/update-usersForm/:id",
        element: (
          <PrivateRoute>
            <UpdateUsersForm />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_BASE_URL}/api/users/${params.id}`),
      },
      {
        path: "/tramessy/Login",
        element: <Login />,
      },
      {
        path: "/tramessy/ResetPass",
        element: <ResetPass />,
      },
      // {
      //   path: "/tramessy/update-DailyIncomeForm/:id",
      //   element: (
      //     <AdminRoute>
      //       <UpdateDailyIncomeForm />
      //     </AdminRoute>
      //   ),
      //   loader: ({ params }) =>
      //     fetch(`${import.meta.env.VITE_BASE_URL}/api/trip/${params.id}`),
      // },
      // {
      //   path: "/tramessy/Update-ExpenseForm/:id",
      //   element: (
      //     <PrivateRoute>
      //       <UpdateExpenseForm />
      //     </PrivateRoute>
      //   ),
      //   loader: ({ params }) =>
      //     fetch(`${import.meta.env.VITE_BASE_URL}/api/trip/${params.id}`),
      // },
    ],
  },
]);
