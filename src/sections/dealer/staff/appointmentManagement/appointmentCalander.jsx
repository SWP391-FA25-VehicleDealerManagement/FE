// WeeklyCalendar.jsx (Đã nâng cấp với các View Ngày/Tuần/Tháng/Năm)
import React, { useState, useEffect } from "react";
import {
  Typography,
  Spin,
  Card,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Tooltip,
  Calendar, // Import component Calendar của AntD
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

// Cấu hình dayjs
dayjs.locale("vi");
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const { Text, Title } = Typography;

// --- DỮ LIỆU MẪU (Giữ nguyên) ---
const sampleAppointments = [
  {
    testDriveId: 1,
    scheduledDate: "2025-10-27T10:00:00Z", // Thứ 2 tuần này
    endDate: "2025-10-27T11:30:00Z",
    status: "SCHEDULED",
    customerId: 101,
    vehicleId: 201,
    notes: "Khách hàng tiềm năng",
  },
  {
    testDriveId: 2,
    scheduledDate: "2025-10-29T14:00:00Z", // Thứ 4
    endDate: "2025-10-29T15:00:00Z",
    status: "CONFIRMED",
    customerId: 102,
    vehicleId: 205,
    notes: "Đã xác nhận qua điện thoại",
  },
  {
    testDriveId: 3,
    scheduledDate: "2025-10-30T09:00:00Z", // Thứ 5
    endDate: "2025-10-30T10:00:00Z",
    status: "SCHEDULED",
    customerId: 103,
    vehicleId: 202,
    notes: "",
  },
  {
    testDriveId: 4,
    scheduledDate: "2025-10-30T11:00:00Z", // Thứ 5
    endDate: "2025-10-30T12:00:00Z",
    status: "COMPLETED",
    customerId: 104,
    vehicleId: 201,
    notes: "Hoàn thành lái thử",
  },
  {
    testDriveId: 5,
    scheduledDate: "2025-10-29T11:00:00Z", // Thứ 4 (Hôm nay, giả sử hôm nay là 29/10/2025)
    endDate: "2025-10-29T12:00:00Z",
    status: "CANCELLED",
    customerId: 105,
    vehicleId: 203,
    notes: "Khách hủy",
  },
  {
    testDriveId: 6,
    scheduledDate: "2025-11-02T13:00:00Z", // Chủ nhật
    endDate: "2025-11-02T15:00:00Z",
    status: "SCHEDULED",
    customerId: 106,
    vehicleId: 204,
    notes: "Hẹn chiều Chủ Nhật",
  },
  {
    testDriveId: 7,
    scheduledDate: "2025-10-27T12:00:00Z", // Thứ 2
    endDate: "2025-10-27T13:30:00Z",
    status: "CONFIRMED",
    customerId: 107,
    vehicleId: 207,
    notes: "Khách VIP",
  },
];

// Giờ bắt đầu và kết thúc của lịch (8 AM - 6 PM)
const START_HOUR = 8;
const END_HOUR = 18; // Hiển thị đến 17:00 slot

// --- CÁC HÀM HELPER (Giữ nguyên) ---
const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "SCHEDULED": return "blue";
    case "CONFIRMED": return "green";
    case "COMPLETED": return "gray";
    case "CANCELLED": return "red";
    default: return "default";
  }
};

const generateTimeSlots = () => {
  const slots = [];
  for (let i = START_HOUR; i < END_HOUR; i++) {
    slots.push(dayjs().hour(i).minute(0).second(0).format("HH:mm"));
  }
  return slots;
};

// --- COMPONENT CHÍNH ---
export default function WeeklyCalendar() {
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs("2025-10-29")); // Ngày có data để demo
  const [weekDays, setWeekDays] = useState([]);
  const [timeSlots] = useState(generateTimeSlots());
  
  // (MỚI) State cho chế độ xem
  const [currentView, setCurrentView] = useState('week'); // 'day', 'week', 'month', 'year'

  // Cập nhật mảng 7 ngày (chỉ dùng cho view Tuần)
  useEffect(() => {
    const startOfWeek = currentDate.startOf("week");
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, "day"));
    }
    setWeekDays(days);
  }, [currentDate]);

  // --- (CẬP NHẬT) Hàm điều hướng ---
  const handlePrev = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(currentDate.subtract(1, 'day'));
        break;
      case 'week':
        setCurrentDate(currentDate.subtract(1, 'week'));
        break;
      case 'month':
        setCurrentDate(currentDate.subtract(1, 'month'));
        break;
      case 'year':
        setCurrentDate(currentDate.subtract(1, 'year'));
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
     switch (currentView) {
      case 'day':
        setCurrentDate(currentDate.add(1, 'day'));
        break;
      case 'week':
        setCurrentDate(currentDate.add(1, 'week'));
        break;
      case 'month':
        setCurrentDate(currentDate.add(1, 'month'));
        break;
      case 'year':
        setCurrentDate(currentDate.add(1, 'year'));
        break;
      default:
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  // --- (CẬP NHẬT) Render Header ---
  const renderHeader = () => {
    let title = "";

    // Tùy chỉnh Tiêu đề (Title) dựa trên View
    switch (currentView) {
      case 'day':
        title = currentDate.format('dddd, DD/MM/YYYY');
        break;
      case 'week':
        if (weekDays.length > 0) {
          const start = weekDays[0].format("DD/MM");
          const end = weekDays[6].format("DD/MM/YYYY");
          title = `${start} - ${end}`;
        }
        break;
      case 'month':
        title = currentDate.format('MMMM YYYY');
        break;
      case 'year':
        title = currentDate.format('YYYY');
        break;
      default:
        title = currentDate.format('MMMM YYYY');
    }

    return (
      <Row justify="space-between" align="middle" style={{ padding: "8px 12px" }}>
        <Col>
          <Space>
            <Title level={4} style={{ margin: 0, textTransform: 'capitalize' }}>
              {title}
            </Title>
            <Space>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrev} // Cập nhật
                size="small"
              />
              <Button onClick={handleToday} size="small">
                Hôm nay
              </Button>
              <Button
                icon={<RightOutlined />}
                onClick={handleNext} // Cập nhật
                size="small"
              />
            </Space>
            {/* (CẬP NHẬT) Các nút chuyển View */}
            <Button.Group size="small">
              <Button type={currentView === 'day' ? 'primary' : 'default'} onClick={() => setCurrentView('day')}>Ngày</Button>
              <Button type={currentView === 'week' ? 'primary' : 'default'} onClick={() => setCurrentView('week')}>Tuần</Button>
              <Button type={currentView === 'month' ? 'primary' : 'default'} onClick={() => setCurrentView('month')}>Tháng</Button>
              <Button type={currentView === 'year' ? 'primary' : 'default'} onClick={() => setCurrentView('year')}>Năm</Button>
            </Button.Group>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => alert("Mở form tạo lịch hẹn mới...")}>
            Tạo lịch hẹn
          </Button>
        </Col>
      </Row>
    );
  };

  // --- Helper tính toán vị trí trên Grid (Dùng cho Day/Week View) ---
  const getRowStart = (time) => {
    const hour = dayjs(time).hour();
    const minute = dayjs(time).minute();
    const baseRow = (hour - START_HOUR) * 2 + 2;
    return minute < 30 ? baseRow : baseRow + 1;
  };

  const getRowEnd = (time) => {
     const hour = dayjs(time).hour();
     const minute = dayjs(time).minute();
     const baseRow = (hour - START_HOUR) * 2 + 2;
     return minute === 0 ? baseRow : (minute <= 30 ? baseRow + 1 : baseRow + 2);
  };
  
  // --- CÁC HÀM RENDER CHO TỪNG VIEW ---

  // (MỚI) Render Lưới 1 Ngày (Day View)
  const renderDayGrid = () => {
    const filteredAppointments = appointments.filter(app => 
        dayjs(app.scheduledDate).isSame(currentDate, 'day')
    );
    const totalRows = (END_HOUR - START_HOUR) * 2;
    const isToday = currentDate.isSame(dayjs(), "day");

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr", // 1 cột giờ, 1 cột ngày
          gridTemplateRows: `auto repeat(${totalRows}, 40px)`,
          borderTop: "1px solid #f0f0f0",
        }}
      >
        {/* Cột Giờ */}
        <div style={{ gridColumn: 1, gridRow: 1 }} />
        {timeSlots.map((time, index) => (
          <div
            key={time}
            style={{
              gridColumn: 1,
              gridRow: `${index * 2 + 2} / span 2`,
              textAlign: "right", paddingRight: 8, fontSize: 12, color: "#8c8c8c",
              borderTop: "1px solid #f0f0f0", paddingTop: 4,
            }}
          >
            {time}
          </div>
        ))}
        
        {/* Tiêu Đề Ngày */}
        <div
          style={{
            gridColumn: 2,
            gridRow: 1,
            textAlign: "center", padding: "8px 0",
            borderBottom: "1px solid #f0f0f0", borderLeft: "1px solid #f0f0f0",
            backgroundColor: isToday ? "#f6ffed" : "#fff",
          }}
        >
          <Text strong>{currentDate.format("ddd")}</Text>
          <br />
          <Text style={{ fontSize: 18, color: isToday ? '#52c41a' : 'inherit' }}>
            {currentDate.format("DD")}
          </Text>
        </div>

        {/* Lưới Nền */}
        {Array.from({ length: totalRows }).map((_, i) => (
           <div
              key={`grid-${i}`}
              style={{
                gridColumn: 2,
                gridRow: i + 2,
                borderBottom: (i % 2 !== 0) ? "1px solid #f0f0f0" : "1px dashed #f0f0f0",
                borderLeft: "1px solid #f0f0f0",
                backgroundColor: isToday ? "#fafafa" : "#fff",
              }}
            />
        ))}

        {/* Các Cuộc Hẹn */}
        {filteredAppointments.map((item) => {
          const gridCol = 2; // Luôn là cột 2
          const gridRowStart = getRowStart(item.scheduledDate);
          const gridRowEnd = getRowEnd(item.endDate);
          const color = getStatusColor(item.status);

          return (
            <Tooltip title={`${dayjs(item.scheduledDate).format("HH:mm")} - ${dayjs(item.endDate).format("HH:mm")}: ${item.notes || 'Không có ghi chú'}`} key={item.testDriveId}>
              <Card
                size="small"
                style={{
                  gridColumn: gridCol,
                  gridRow: `${gridRowStart} / ${gridRowEnd}`,
                  margin: "1px 2px", padding: "2px 4px",
                  backgroundColor: `${color}1A`,
                  borderLeft: `3px solid var(--ant-colors-${color})`,
                  overflow: "hidden", cursor: "pointer", zIndex: 1,
                }}
              >
                <Text strong style={{ fontSize: 12, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  KH: {item.customerId} - Xe: {item.vehicleId}
                </Text>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.notes || 'Không có ghi chú'}
                </Text>
                 <Tag color={color} style={{ fontSize: 10, padding: '0 4px', margin: '2px 0 0 0'}}>
                   {item.status}
                 </Tag>
              </Card>
            </Tooltip>
          );
        })}
      </div>
    );
  };
  
  // Render Lưới 7 Ngày (Week View) - (Giữ nguyên logic từ trước)
  const renderWeekGrid = () => {
    if (weekDays.length === 0) return <Spin />;

    const startOfWeek = weekDays[0].startOf('day');
    const endOfWeek = weekDays[6].endOf('day');
    const filteredAppointments = appointments.filter(app => 
        dayjs(app.scheduledDate).isBetween(startOfWeek, endOfWeek)
    );
    const totalRows = (END_HOUR - START_HOUR) * 2;

    const getColumn = (date) => {
      const dayIndex = weekDays.findIndex((day) => day.isSame(date, "day"));
      return dayIndex !== -1 ? dayIndex + 2 : -1;
    };

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px repeat(7, 1fr)",
          gridTemplateRows: `auto repeat(${totalRows}, 40px)`,
          borderTop: "1px solid #f0f0f0",
          overflowX: "auto",
        }}
      >
        {/* Cột Giờ */}
        <div style={{ gridColumn: 1, gridRow: 1 }} />
        {timeSlots.map((time, index) => (
          <div
            key={time}
            style={{
              gridColumn: 1,
              gridRow: `${index * 2 + 2} / span 2`,
              textAlign: "right", paddingRight: 8, fontSize: 12, color: "#8c8c8c",
              borderTop: "1px solid #f0f0f0", paddingTop: 4,
            }}
          >
            {time}
          </div>
        ))}

        {/* Tiêu Đề Ngày */}
        {weekDays.map((day, index) => {
          const isToday = day.isSame(dayjs(), "day");
          return (
            <div
              key={day.format("YYYY-MM-DD")}
              style={{
                gridColumn: index + 2,
                gridRow: 1,
                textAlign: "center", padding: "8px 0",
                borderBottom: "1px solid #f0f0f0", borderLeft: "1px solid #f0f0f0",
                backgroundColor: isToday ? "#f6ffed" : "#fff",
                minWidth: 120, // Độ rộng tối thiểu cho mỗi ngày
              }}
            >
              <Text strong>{day.format("ddd")}</Text>
              <br />
              <Text style={{ fontSize: 18, color: isToday ? '#52c41a' : 'inherit' }}>
                {day.format("DD")}
              </Text>
            </div>
          );
        })}

        {/* Lưới Nền */}
        {weekDays.map((day, dayIndex) => (
           Array.from({ length: totalRows }).map((_, i) => (
              <div
                key={`${day.format('YYYY-MM-DD')}-${i}`}
                style={{
                  gridColumn: dayIndex + 2,
                  gridRow: i + 2,
                  borderBottom: (i % 2 !== 0) ? "1px solid #f0f0f0" : "1px dashed #f0f0f0",
                  borderLeft: "1px solid #f0f0f0",
                  backgroundColor: day.isSame(dayjs(), "day") ? "#fafafa" : "#fff",
                }}
              />
            ))
        ))}


        {/* Các Cuộc Hẹn */}
        {filteredAppointments.map((item) => {
          const gridCol = getColumn(item.scheduledDate);
          const gridRowStart = getRowStart(item.scheduledDate);
          const gridRowEnd = getRowEnd(item.endDate);

          if (gridCol === -1 || gridRowStart > totalRows + 1 || gridRowEnd < 2) {
            return null;
          }
          
          const color = getStatusColor(item.status);

          return (
            <Tooltip title={`${dayjs(item.scheduledDate).format("HH:mm")} - ${dayjs(item.endDate).format("HH:mm")}: ${item.notes || 'Không có ghi chú'}`} key={item.testDriveId}>
              <Card
                size="small"
                style={{
                  gridColumn: gridCol,
                  gridRow: `${gridRowStart} / ${gridRowEnd}`,
                  margin: "1px 2px", padding: "2px 4px",
                  backgroundColor: `${color}1A`,
                  borderLeft: `3px solid var(--ant-colors-${color})`,
                  overflow: "hidden", cursor: "pointer", zIndex: 1,
                }}
              >
                <Text strong style={{ fontSize: 12, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  KH: {item.customerId} - Xe: {item.vehicleId}
                </Text>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.notes || 'Không có ghi chú'}
                </Text>
                 <Tag color={color} style={{ fontSize: 10, padding: '0 4px', margin: '2px 0 0 0'}}>
                   {item.status}
                 </Tag>
              </Card>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  // (MỚI) Render Lịch Tháng (Month View)
  const renderMonthGrid = () => {
    const onPanelChange = (date, mode) => {
      setCurrentDate(date);
      // Giữ ở 'month' view, không cho AntD tự chuyển
      // Hoặc: setCurrentView(mode);
    };

    const onDateSelect = (date) => {
      setCurrentDate(date);
      setCurrentView('day'); // Click vào 1 ngày -> chuyển sang 'day' view
    };

    // Tùy chỉnh cell ngày để hiển thị các tag cuộc hẹn
    const dateCellRender = (date) => {
      const dayAppointments = appointments.filter(app => date.isSame(app.scheduledDate, 'day'));
      
      if (dayAppointments.length > 0) {
        return (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 60, overflowY: 'auto' }}>
            {dayAppointments.map(item => (
              <li key={item.testDriveId}>
                <Tag color={getStatusColor(item.status)} style={{ fontSize: 10, margin: '1px 0' }}>
                  {dayjs(item.scheduledDate).format('HH:mm')} - KH {item.customerId}
                </Tag>
              </li>
            ))}
          </ul>
        );
      }
      return null;
    };

    return (
      <div style={{ borderTop: "1px solid #f0f0f0", padding: 8 }}>
        <Calendar
          value={currentDate}
          mode="month"
          onPanelChange={onPanelChange}
          onSelect={onDateSelect}
          dateCellRender={dateCellRender}
        />
      </div>
    );
  };
  
  // (MỚI) Render Lịch Năm (Year View)
  const renderYearGrid = () => {
     const onPanelChange = (date, mode) => {
      setCurrentDate(date);
      // Nếu user click vào 1 tháng, AntD sẽ tự chuyển mode='month'
      setCurrentView(mode);
    };

    const onDateSelect = (date) => {
      // Trong 'year' mode, 'date' là 1 tháng
      setCurrentDate(date);
      setCurrentView('month'); // Click vào 1 tháng -> chuyển sang 'month' view
    };

     return (
       <div style={{ borderTop: "1px solid #f0f0f0", padding: 8 }}>
          <Calendar
            value={currentDate}
            mode="year"
            onPanelChange={onPanelChange}
            onSelect={onDateSelect}
          />
       </div>
    );
  };
  
  // (MỚI) Hàm Render Chính
  const renderCalendarBody = () => {
    if (isLoading) {
      return (
        <div style={{ padding: 48, textAlign: "center" }}>
          <Spin />
        </div>
      );
    }

    // Dùng switch...case để chọn view
    switch (currentView) {
      case 'day':
        return renderDayGrid();
      case 'week':
        return renderWeekGrid();
      case 'month':
        return renderMonthGrid();
      case 'year':
        return renderYearGrid();
      default:
        return renderWeekGrid();
    }
  };

  // --- RETURN CHÍNH CỦA COMPONENT ---
  return (
    <Card bodyStyle={{ padding: 0 }}>
      {renderHeader()}
      {renderCalendarBody()}
    </Card>
  );
}