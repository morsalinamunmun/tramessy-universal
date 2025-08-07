
// import React, { useEffect, useState } from "react";
// import { Table, Typography, Card } from "antd";
// import axios from "axios";
// import dayjs from "dayjs";
// import { SlCalender } from "react-icons/sl";
// import api from "../utils/axiosConfig";

// const { Title, Text } = Typography;

// const MonthlyStatement = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   })

//   // const fetchData = async () => {
//   //   try {
//   //     const [tripRes, fuelRes, maintenanceRes] = await Promise.all([
//   //       api.get(`/api/trip`),
//   //       api.get(`/api/fuel`),
//   //       api.get(`/api/maintaince`),
//   //     ]);

//   //     const tripData = tripRes.data || [];
//   //     const fuelData = fuelRes.data || [];
//   //     const maintenanceData = maintenanceRes.data || [];

//   //     const allMonths = {};
//   //     const getMonthKey = date => dayjs(date).format("YYYY-MM");

//   //     tripData.forEach(item => {
//   //       const month = getMonthKey(item.date);
//   //       if (!allMonths[month]) allMonths[month] = { income: 0, trip: 0, maintain: 0 };

//   //       allMonths[month].income += parseFloat(item.Rent_amount) || 0;
//   //       allMonths[month].trip +=
//   //         (parseFloat(item.fuel_cost) || 0) +
//   //         (parseFloat(item.toll_cost) || 0) +
//   //         (parseFloat(item.police_cost) || 0) +
//   //         (parseFloat(item.commision) || 0) +
//   //         (parseFloat(item.labour) || 0) +
//   //         (parseFloat(item.others) || 0) +
//   //         (parseFloat(item.demrage_total) || 0);
//   //     });

//   //     fuelData.forEach(item => {
//   //       const month = getMonthKey(item.date);
//   //       if (!allMonths[month]) allMonths[month] = { income: 0, trip: 0, maintain: 0 };

//   //       allMonths[month].trip += parseFloat(item.total_cost) || 0;
//   //     });

//   //     maintenanceData.forEach((item) => {
//   //       const month = getMonthKey(item.date);
//   //       if (!allMonths[month]) {
//   //         allMonths[month] = { income: 0, trip: 0, maintain: 0 };
//   //       }
//   //       const maintenanceCost = parseFloat(item.total_cost) || 0;
//   //       allMonths[month].maintain += maintenanceCost;
//   //     });

//   //     const sorted = Object.entries(allMonths)
//   //       .sort(([a], [b]) => dayjs(b).diff(dayjs(a)))
//   //       .map(([month, value], index) => {
//   //         const totalExpense = value.trip + value.maintain;
//   //         return {
//   //           key: index + 1,
//   //           month: dayjs(month).format("MMMM YYYY"),
//   //           income: value.income,
//   //           trip: value.trip,
//   //           maintain: value.maintain,
//   //           total: totalExpense,
//   //           profit: value.income - totalExpense,
//   //         };
//   //       });

//   //     setData(sorted);
//   //   } catch (err) {
//   //     console.error("Error loading statement data", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchData = async () => {
//   try {
//     const [tripRes, fuelRes, maintenanceRes] = await Promise.all([
//       api.get(`/api/trip`),
//       api.get(`/api/fuel`),
//       api.get(`/api/payments`),
//       api.get(`/api/maintaince`),
//     ]);

//     const tripData = tripRes.data || [];
//     const fuelData = fuelRes.data || [];
//     const maintenanceData = maintenanceRes.data || [];

//     const allMonths = {};
//     const getMonthKey = date => dayjs(date).format("YYYY-MM");

//     tripData.forEach(item => {
//       const month = getMonthKey(item.date);
//       if (!allMonths[month]) allMonths[month] = { income: 0, trip: 0, fuel: 0, maintain: 0 };

//       allMonths[month].income += parseFloat(item.Rent_amount) || 0;
//       allMonths[month].trip +=
//         (parseFloat(item.toll_cost) || 0) +
//         (parseFloat(item.fuel_cost) || 0) +
//         (parseFloat(item.police_cost) || 0) +
//         (parseFloat(item.commision) || 0) +
//         (parseFloat(item.labour) || 0) +
//         (parseFloat(item.others) || 0) +
//         (parseFloat(item.demrage_total) || 0);
//     });

//     fuelData.forEach(item => {
//       const month = getMonthKey(item.date);
//       if (!allMonths[month]) allMonths[month] = { income: 0, trip: 0, fuel: 0, maintain: 0 };

//       const fuelCost = parseFloat(item.total_cost) || 0;
//       allMonths[month].fuel += fuelCost;
//     });

//     maintenanceData.forEach((item) => {
//       const month = getMonthKey(item.date);
//       if (!allMonths[month]) {
//         allMonths[month] = { income: 0, trip: 0, fuel: 0, maintain: 0 };
//       }
//       const maintenanceCost = parseFloat(item.total_cost) || 0;
//       allMonths[month].maintain += maintenanceCost;
//     });

//     const sorted = Object.entries(allMonths)
//       .sort(([a], [b]) => dayjs(b).diff(dayjs(a)))
//       .map(([month, value], index) => {
//         const totalExpense = value.trip + value.fuel + value.maintain;
//         return {
//           key: index + 1,
//           month: dayjs(month).format("MMMM YYYY"),
//           income: value.income,
//           trip: value.trip,
//           fuel: value.fuel,
//           maintain: value.maintain,
//           total: totalExpense,
//           profit: value.income - totalExpense,
//         };
//       });

//     setData(sorted);
//   } catch (err) {
//     console.error("Error loading statement data", err);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns = [
//     {
//       title: "SL",
//       dataIndex: "key",
//       render: (text) => <Text strong>{text}</Text>,
//     },
//     {
//       title: "Month",
//       dataIndex: "month",
//     },
//     {
//       title: "Total Income",
//       dataIndex: "income",
//       render: (value) => (
//         <Text className="text-green-600">
//           {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </Text>
//       ),
//     },
//     {
//   title: "Fuel Cost",
//   dataIndex: "fuel",
//   render: (value) => (
//     <Text className="text-red-500">
//       {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//     </Text>
//   ),
// },
//     {
//       title: "Trip Expenses",
//       dataIndex: "trip",
//       render: (value) => (
//         <Text className="text-red-500">
//           {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </Text>
//       ),
//     },
//     {
//       title: "Maintenance Cost",
//       dataIndex: "maintain",
//       render: (value) => (
//         <Text className="text-red-500">
//           {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </Text>
//       ),
//     },
//     {
//       title: "Daily Cost",
//       dataIndex: "dailyCost",
//       render: (value) => (
//         <Text className="text-red-500">
        
//         </Text>
//       ),
//     },
//     {
//       title: "Total Expenses",
//       dataIndex: "total",
//       render: (value) => (
//         <Text className="text-red-500">
//           {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </Text>
//       ),
//     },
//     {
//       title: "Net Profit",
//       dataIndex: "profit",
//       render: (value) => (
//         <Text strong style={{ color: value >= 0 ? "#22c55e" : "#ff4d4f" }}>
//           {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </Text>
//       ),
//     },
//   ];

//   const summary = () => {
//     const totalIncome = data.reduce((acc, cur) => acc + cur.income, 0);
//     const totalTrip = data.reduce((acc, cur) => acc + cur.trip, 0);
//     const totalMaintain = data.reduce((acc, cur) => acc + cur.maintain, 0);
//     const totalFuel = data.reduce((acc, cur) => acc + cur.fuel, 0);
//     const totalExpense = totalTrip + totalFuel + totalMaintain;
//     const totalProfit = totalIncome - totalExpense;

//     return (
//       <Table.Summary fixed>
//         <Table.Summary.Row className="bg-blue-50">
//           <Table.Summary.Cell index={0} colSpan={2}>
//             <Text strong>Total:</Text>
//           </Table.Summary.Cell>
//           <Table.Summary.Cell>
//             <Text strong className="text-green-700">
//               {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Text>
//           </Table.Summary.Cell>
//           <Table.Summary.Cell>
//   <Text strong>
//     {totalFuel.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//   </Text>
// </Table.Summary.Cell>
//           <Table.Summary.Cell>
//             <Text strong>
//               {totalTrip.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Text>
//           </Table.Summary.Cell>
//           <Table.Summary.Cell>
//             <Text strong>
//               {totalMaintain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Text>
//           </Table.Summary.Cell>
//           <Table.Summary.Cell>
//             <Text strong>
//               {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Text>
//           </Table.Summary.Cell>
//           <Table.Summary.Cell>
//             <Text strong className="text-green-700">
//               {totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Text>
//           </Table.Summary.Cell>
//         </Table.Summary.Row>
//       </Table.Summary>
//     );
//   };

//   return (
//     <div className="p-[10px]">
//       <Card>
//         <Title level={4} className="flex gap-3 items-center"><SlCalender />Monthly Statement</Title>
//         <Table
//           dataSource={data}
//           columns={columns}
//           loading={loading}
//           bordered
//           summary={summary}
//           scroll={{ x: "max-content" }}
//           className="mt-4"
//           size="small"
//           pagination={{
//             current: pagination.current,
//             pageSize: pagination.pageSize,
//             showSizeChanger: true,
//             pageSizeOptions: ["10", "20", "50", "100"],
//             onChange: (page, pageSize) => {
//               setPagination({ current: page, pageSize })
//             },
//             onShowSizeChange: (current, size) => {
//               setPagination({ current: 1, pageSize: size })
//             },
//           }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default MonthlyStatement;


import React, { useEffect, useState } from "react";
import { Table, Typography, Card } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { SlCalender } from "react-icons/sl";
import api from "../utils/axiosConfig";

const { Title, Text } = Typography;

const MonthlyStatement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    try {
      const [tripRes, fuelRes, paymentsRes, maintenanceRes] = await Promise.all([
        api.get(`/api/trip`),
        api.get(`/api/fuel`),
        api.get(`/api/payments`),
        api.get(`/api/maintaince`),
      ]);

      const tripData = tripRes.data || [];
      const fuelData = fuelRes.data || [];
      const paymentsData = paymentsRes.data || [];
      const maintenanceData = maintenanceRes.data || [];

      const allMonths = {};
      const getMonthKey = date => dayjs(date).format("YYYY-MM");

      // Process trip data
      tripData.forEach(item => {
        const month = getMonthKey(item.date);
        if (!allMonths[month]) {
          allMonths[month] = { 
            income: 0, 
            trip: 0, 
            fuel: 0, 
            maintain: 0,
            dailyExpense: 0 
          };
        }

        allMonths[month].income += parseFloat(item.Rent_amount) || 0;
        allMonths[month].trip +=
          (parseFloat(item.toll_cost) || 0) +
          (parseFloat(item.fuel_cost) || 0) +
          (parseFloat(item.police_cost) || 0) +
          (parseFloat(item.commision) || 0) +
          (parseFloat(item.labour) || 0) +
          (parseFloat(item.others) || 0) +
          (parseFloat(item.demrage_total) || 0);
      });

      // Process fuel data
      fuelData.forEach(item => {
        const month = getMonthKey(item.date);
        if (!allMonths[month]) {
          allMonths[month] = { 
            income: 0, 
            trip: 0, 
            fuel: 0, 
            maintain: 0,
            dailyExpense: 0 
          };
        }
        const fuelCost = parseFloat(item.total_cost) || 0;
        allMonths[month].fuel += fuelCost;
      });

      // Process maintenance data
      maintenanceData.forEach((item) => {
        const month = getMonthKey(item.date);
        if (!allMonths[month]) {
          allMonths[month] = { 
            income: 0, 
            trip: 0, 
            fuel: 0, 
            maintain: 0,
            dailyExpense: 0 
          };
        }
        const maintenanceCost = parseFloat(item.total_cost) || 0;
        allMonths[month].maintain += maintenanceCost;
      });

      // Process daily expenses from payments
      paymentsData.forEach((item) => {
        const month = getMonthKey(item.date);
        if (!allMonths[month]) {
          allMonths[month] = { 
            income: 0, 
            trip: 0, 
            fuel: 0, 
            maintain: 0,
            dailyExpense: 0 
          };
        }
        const paymentAmount = parseFloat(item.amount) || 0;
        allMonths[month].dailyExpense += paymentAmount;
      });

      // Prepare final data with all expense categories
      const sorted = Object.entries(allMonths)
        .sort(([a], [b]) => dayjs(b).diff(dayjs(a)))
        .map(([month, value], index) => {
          const totalExpense = value.trip + value.fuel + value.maintain + value.dailyExpense;
          return {
            key: index + 1,
            month: dayjs(month).format("MMMM YYYY"),
            income: value.income,
            trip: value.trip,
            fuel: value.fuel,
            maintain: value.maintain,
            dailyExpense: value.dailyExpense,
            total: totalExpense,
            profit: value.income - totalExpense,
          };
        });

      setData(sorted);
    } catch (err) {
      console.error("Error loading statement data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Month",
      dataIndex: "month",
    },
    {
      title: "Total Income",
      dataIndex: "income",
      render: (value) => (
        <Text className="text-green-600">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "Fuel Cost",
      dataIndex: "fuel",
      render: (value) => (
        <Text className="text-red-500">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "Trip Expenses",
      dataIndex: "trip",
      render: (value) => (
        <Text className="text-red-500">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "Maintenance Cost",
      dataIndex: "maintain",
      render: (value) => (
        <Text className="text-red-500">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "Daily Expenses",
      dataIndex: "dailyExpense",
      render: (value) => (
        <Text className="text-red-500">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "Total Expenses",
      dataIndex: "total",
      render: (value) => (
        <Text className="text-red-500">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "Net Profit",
      dataIndex: "profit",
      render: (value) => (
        <Text strong style={{ color: value >= 0 ? "#22c55e" : "#ff4d4f" }}>
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
  ];

  const summary = () => {
    const totalIncome = data.reduce((acc, cur) => acc + cur.income, 0);
    const totalTrip = data.reduce((acc, cur) => acc + cur.trip, 0);
    const totalMaintain = data.reduce((acc, cur) => acc + cur.maintain, 0);
    const totalFuel = data.reduce((acc, cur) => acc + cur.fuel, 0);
    const totalDailyExpense = data.reduce((acc, cur) => acc + cur.dailyExpense, 0);
    const totalExpense = totalTrip + totalFuel + totalMaintain + totalDailyExpense;
    const totalProfit = totalIncome - totalExpense;

    return (
      <Table.Summary fixed>
        <Table.Summary.Row className="bg-blue-50">
          <Table.Summary.Cell index={0} colSpan={2}>
            <Text strong>Total:</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong className="text-green-700">
              {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>
              {totalFuel.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>
              {totalTrip.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>
              {totalMaintain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>
              {totalDailyExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>
              {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong className="text-green-700">
              {totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <div className="p-[10px]">
      <Card>
        <Title level={4} className="flex gap-3 items-center">
          <SlCalender /> Monthly Statement
        </Title>
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          bordered
          summary={summary}
          scroll={{ x: "max-content" }}
          className="mt-4"
          size="small"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
            onShowSizeChange: (current, size) => {
              setPagination({ current: 1, pageSize: size });
            },
          }}
        />
      </Card>
    </div>
  );
};

export default MonthlyStatement;