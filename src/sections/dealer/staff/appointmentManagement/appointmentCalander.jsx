import React, { useState, useEffect, useCallback } from "react";
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
  Calendar,
  Modal,
} from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import CreateAppointmentModal from "./CreateAppointmentModal";
import useTestDriveStore from "../../../../hooks/useTestDrive";
import useVehicleStore from "../../../../hooks/useVehicle";
import useDealerOrder from "../../../../hooks/useDealerOrder";
import useAuthen from "../../../../hooks/useAuthen";

dayjs.locale("vi");
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const { Text, Title } = Typography;

const START_HOUR = 8;
const END_HOUR = 18;
const DEFAULT_DURATION_MINUTES = 60;

const getStatusProps = (status) => {
  const upperStatus = status?.toUpperCase();
  switch (upperStatus) {
    case "SCHEDULED":
      return { color: "blue", text: "Đã lên lịch" };
    case "CONFIRMED":
      return { color: "green", text: "Đã xác nhận" };
    case "COMPLETED":
      return { color: "gray", text: "Đã hoàn thành" };
    case "CANCELLED":
      return { color: "red", text: "Đã hủy" };
    default:
      return { color: "default", text: status || "Không rõ" };
  }
};

const generateTimeSlots = () => {
  const slots = [];
  for (let i = START_HOUR; i < END_HOUR; i++) {
    slots.push(dayjs().hour(i).minute(0).second(0).format("HH:mm"));
  }
  return slots;
};

export default function WeeklyCalendar() {
  const [processedAppointments, setProcessedAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [weekDays, setWeekDays] = useState([]);
  const [timeSlots] = useState(generateTimeSlots());
  const [currentView, setCurrentView] = useState("week");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { userDetail } = useAuthen();
  const dealerId = userDetail?.dealer?.dealerId;
  const { testDrives, fetchTestDrives, isLoadingTestDrives } =
    useTestDriveStore();

  const isLoading = isLoadingTestDrives;

  useEffect(() => {
    if (dealerId) {
      fetchTestDrives(dealerId);
    }
  }, [dealerId]);

  useEffect(() => {
    if (!testDrives) {
      setProcessedAppointments([]);
      return;
    }

    const processedData = testDrives.map((drive) => {
      const endDate = dayjs(drive.scheduledDate)
        .add(DEFAULT_DURATION_MINUTES, "minute")
        .toISOString();

      return {
        ...drive,
        endDate: endDate,
      };
    });

    setProcessedAppointments(processedData);
    console.log("check data", processedAppointments);
  }, [testDrives]);

  useEffect(() => {
    const startOfWeek = currentDate.startOf("week");
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, "day"));
    }
    setWeekDays(days);
  }, [currentDate]);

  const handleMonthPanelChange = useCallback(
    (date) => {
      setCurrentDate(date);
    },
    [setCurrentDate]
  ); // Dependencies are the state setters

  const handleMonthDateSelect = useCallback(
    (date) => {
      setCurrentDate(date);
      setCurrentView("day");
    },
    [setCurrentDate, setCurrentView]
  );

  const handleYearPanelChange = useCallback(
    (date, mode) => {
      setCurrentDate(date);
      setCurrentView(mode);
    },
    [setCurrentDate, setCurrentView]
  );

  const handleYearDateSelect = useCallback(
    (date) => {
      setCurrentDate(date);
      setCurrentView("month");
    },
    [setCurrentDate, setCurrentView]
  );

  const dateCellRender = useCallback(
    (date) => {
      const dayAppointments = processedAppointments.filter((app) =>
        date.isSame(app.scheduledDate, "day")
      );

      if (dayAppointments.length > 0) {
        return (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              maxHeight: 60,
              overflowY: "auto",
            }}
          >
            {dayAppointments.map((item) => (
              <li key={item.testDriveId}>
                <Tag
                  color={getStatusProps(item.status).color}
                  style={{ fontSize: 10, margin: "1px 0" }}
                >
                  {dayjs(item.scheduledDate).format("HH:mm")} -{" "}
                  {item.customer?.customerName}
                </Tag>
              </li>
            ))}
          </ul>
        );
      }
      return null;
    },
    [processedAppointments]
  );

  const handlePrev = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(currentDate.subtract(1, "day"));
        break;
      case "week":
        setCurrentDate(currentDate.subtract(1, "week"));
        break;
      case "month":
        setCurrentDate(currentDate.subtract(1, "month"));
        break;
      case "year":
        setCurrentDate(currentDate.subtract(1, "year"));
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(currentDate.add(1, "day"));
        break;
      case "week":
        setCurrentDate(currentDate.add(1, "week"));
        break;
      case "month":
        setCurrentDate(currentDate.add(1, "month"));
        break;
      case "year":
        setCurrentDate(currentDate.add(1, "year"));
        break;
      default:
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const renderHeader = () => {
    let title = "";
    switch (currentView) {
      case "day":
        title = currentDate.format("dddd, DD/MM/YYYY");
        break;
      case "week":
        if (weekDays.length > 0) {
          const start = weekDays[0].format("DD/MM");
          const end = weekDays[6].format("DD/MM/YYYY");
          title = `${start} - ${end}`;
        }
        break;
      case "month":
        title = currentDate.format("MMMM YYYY");
        break;
      case "year":
        title = currentDate.format("YYYY");
        break;
      default:
        title = currentDate.format("MMMM YYYY");
    }

    return (
      <Row
        justify="space-between"
        align="middle"
        style={{ padding: "8px 12px" }}
      >
        <Col>
          <Space>
            <Title level={4} style={{ margin: 0, textTransform: "capitalize" }}>
              {title}
            </Title>
            <Space>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrev}
                size="small"
              />
              <Button onClick={handleToday} size="small">
                Hôm nay
              </Button>
              <Button
                icon={<RightOutlined />}
                onClick={handleNext}
                size="small"
              />
            </Space>
            <Button.Group size="small">
              <Button
                type={currentView === "day" ? "primary" : "default"}
                onClick={() => setCurrentView("day")}
              >
                Ngày
              </Button>
              <Button
                type={currentView === "week" ? "primary" : "default"}
                onClick={() => setCurrentView("week")}
              >
                Tuần
              </Button>
              <Button
                type={currentView === "month" ? "primary" : "default"}
                onClick={() => setCurrentView("month")}
              >
                Tháng
              </Button>
              <Button
                type={currentView === "year" ? "primary" : "default"}
                onClick={() => setCurrentView("year")}
              >
                Năm
              </Button>
            </Button.Group>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Tạo lịch hẹn
          </Button>
        </Col>
      </Row>
    );
  };

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
    return minute === 0 ? baseRow : minute <= 30 ? baseRow + 1 : baseRow + 2;
  };

  const renderDayGrid = () => {
    const filteredAppointments = processedAppointments.filter((app) =>
      dayjs(app.scheduledDate).isSame(currentDate, "day")
    );
    const totalRows = (END_HOUR - START_HOUR) * 2;
    const isToday = currentDate.isSame(dayjs(), "day");

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr",
          gridTemplateRows: `auto repeat(${totalRows}, minmax(40px, auto))`,
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
              textAlign: "right",
              paddingRight: 8,
              fontSize: 12,
              color: "#8c8c8c",
              borderTop: "1px solid #f0f0f0",
              paddingTop: 4,
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
            textAlign: "center",
            padding: "8px 0",
            borderBottom: "1px solid #f0f0f0",
            borderLeft: "1px solid #f0f0f0",
            backgroundColor: isToday ? "#f6ffed" : "#fff",
          }}
        >
          <Text strong>{currentDate.format("ddd")}</Text>
          <br />
          <Text
            style={{ fontSize: 18, color: isToday ? "#52c41a" : "inherit" }}
          >
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
              borderBottom:
                i % 2 !== 0 ? "1px solid #f0f0f0" : "1px dashed #f0f0f0",
              borderLeft: "1px solid #f0f0f0",
              backgroundColor: isToday ? "#fafafa" : "#fff",
            }}
          />
        ))}

        {/* Các Cuộc Hẹn */}
        {filteredAppointments.map((item) => {
          const gridCol = 2;
          const gridRowStart = getRowStart(item.scheduledDate);
          const gridRowEnd = getRowEnd(item.endDate);
          const color = getStatusProps(item.status).color;
          const statusProps = getStatusProps(item.status);

          return (
            <Tooltip
              title={`${dayjs(item.scheduledDate).format("HH:mm")} - ${dayjs(
                item.endDate
              ).format("HH:mm")}: ${item.notes || "Không có ghi chú"}`}
              key={item.testDriveId}
            >
              <Card
                size="small"
                style={{
                  gridColumn: gridCol,
                  gridRow: `${gridRowStart} / ${gridRowEnd}`,
                  margin: "2px",
                  padding: "4px 6px",
                  backgroundColor: `${color}1A`,
                  borderLeft: `4px solid ${
                    color === "blue"
                      ? "#1890ff"
                      : color === "green"
                      ? "#52c4a"
                      : color === "gray"
                      ? "#d9d9d9"
                      : color === "red"
                      ? "#ff4d4f"
                      : "#d9d9d9"
                  }`,
                  borderRadius: 6,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  zIndex: 1,
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)")
                }
                onClick={() => {
                  setSelectedAppointment(item);
                  setIsModalOpen(true);
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 12,
                    display: "block",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  KH: {item.customer?.customerName} - Xe:{" "}
                  {item.vehicle?.variant?.model?.name}{" "}
                  {item.vehicle?.variant?.name}
                </Text>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    display: "block",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Ghi chú: {item.notes || "Không có ghi chú"}
                </Text>
                <Tag
                  color={statusProps.color}
                  style={{
                    fontSize: 10,
                    padding: "0 4px",
                    margin: "2px 0 0 0",
                  }}
                >
                  {statusProps.text}
                </Tag>
              </Card>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  // Render Lưới 7 Ngày (Week View)
  const renderWeekGrid = () => {
    if (weekDays.length === 0) return <Spin />;
    const startOfWeek = weekDays[0].startOf("day");
    const endOfWeek = weekDays[6].endOf("day");
    const filteredAppointments = processedAppointments.filter((app) =>
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
          gridTemplateRows: `auto repeat(${totalRows}, minmax(40px, auto))`,
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
              textAlign: "right",
              paddingRight: 8,
              fontSize: 12,
              color: "#8c8c8c",
              borderTop: "1px solid #f0f0f0",
              paddingTop: 4,
            }}
          >
            {time}
          </div>
        ))}
        {weekDays.map((day, index) => {
          const isToday = day.isSame(dayjs(), "day");
          return (
            <div
              key={day.format("YYYY-MM-DD")}
              style={{
                gridColumn: index + 2,
                gridRow: 1,
                textAlign: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0",
                borderLeft: "1px solid #f0f0f0",
                backgroundColor: isToday ? "#f6ffed" : "#fff",
                minWidth: 120,
              }}
            >
              <Text strong>{currentDate.format("ddd")}</Text>
              <br />
              <Text
                style={{ fontSize: 18, color: isToday ? "#52c41a" : "inherit" }}
              >
                {day.format("DD")}
              </Text>
            </div>
          );
        })}
        {weekDays.map((day, dayIndex) =>
          Array.from({ length: totalRows }).map((_, i) => (
            <div
              key={`${day.format("YYYY-MM-DD")}-${i}`}
              style={{
                gridColumn: dayIndex + 2,
                gridRow: i + 2,
                borderBottom:
                  i % 2 !== 0 ? "1px solid #f0f0f0" : "1px dashed #f0f0f0",
                borderLeft: "1px solid #f0f0f0",
                backgroundColor: day.isSame(dayjs(), "day")
                  ? "#fafafa"
                  : "#fff",
              }}
            />
          ))
        )}

        {/* Các Cuộc Hẹn */}
        {filteredAppointments.map((item) => {
          const gridCol = getColumn(item.scheduledDate);
          const gridRowStart = getRowStart(item.scheduledDate);
          const gridRowEnd = getRowEnd(item.endDate);

          if (
            gridCol === -1 ||
            gridRowStart > totalRows + 1 ||
            gridRowEnd < 2
          ) {
            return null;
          }

          const color = getStatusProps(item.status).color;

          return (
            <Tooltip
              title={`${dayjs(item.scheduledDate).format("HH:mm")} - ${dayjs(
                item.endDate
              ).format("HH:mm")}: ${item.notes || "Không có ghi chú"}`}
              key={item.testDriveId}
            >
              <Card
                size="small"
                style={{
                  gridColumn: gridCol,
                  gridRow: `${gridRowStart} / ${gridRowEnd}`,
                  margin: "2px",
                  padding: "4px 6px",
                  backgroundColor: `${color}1A`,
                  borderLeft: `4px solid ${
                    color === "blue"
                      ? "#1890ff"
                      : color === "green"
                      ? "#52c41a"
                      : color === "gray"
                      ? "#d9d9d9"
                      : color === "red"
                      ? "#ff4d4f"
                      : "#d9d9d9"
                  }`,
                  borderRadius: 6,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                  zIndex: 1,
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)")
                }
                onClick={() => {
                  setSelectedAppointment(item);
                  setIsModalOpen(true);
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 12,
                    display: "block",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  KH: {item.customer?.customerName} - Xe:{" "}
                  {item.vehicle?.variant?.model?.name}{" "}
                  {item.vehicle?.variant?.name}
                </Text>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    display: "block",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Ghi chú: {item.notes || "Không có ghi chú"}
                </Text>
                <Tag
                  color={color}
                  style={{
                    fontSize: 10,
                    padding: "0 4px",
                    margin: "2px 0 0 0",
                  }}
                >
                  {getStatusProps(item.status).text}
                </Tag>
              </Card>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  //  Render Lịch Tháng (Month View)
  const renderMonthGrid = () => {
    return (
      <div style={{ borderTop: "1px solid #f0f0f0", padding: 8 }}>
        <Calendar
          value={currentDate}
          mode="month"
          onPanelChange={handleMonthPanelChange}
          onSelect={handleMonthDateSelect}
          dateCellRender={dateCellRender}
          headerRender={() => null}
        />
      </div>
    );
  };

  // Render Lịch Năm (Year View)
  const renderYearGrid = () => {
    return (
      <div style={{ borderTop: "1px solid #f0f0f0", padding: 8 }}>
        <Calendar
          value={currentDate}
          mode="year"
          onPanelChange={handleYearPanelChange}
          onSelect={handleYearDateSelect}
          headerRender={() => null}
        />
      </div>
    );
  };

  // Hàm Render Chính
  const renderCalendarBody = () => {
    if (isLoading) {
      return (
        <div style={{ padding: 48, textAlign: "center" }}>
          <Spin />
        </div>
      );
    }

    switch (currentView) {
      case "day":
        return renderDayGrid();
      case "week":
        return renderWeekGrid();
      case "month":
        return renderMonthGrid();
      case "year":
        return renderYearGrid();
      default:
        return renderWeekGrid();
    }
  };

  console.log("check select,", selectedAppointment);

  return (
    <>
      <Card styles={{ body: { padding: 0 } }}>
        {renderHeader()}
        {renderCalendarBody()}
      </Card>
      <Modal
        title="Chi tiết lịch hẹn lái thử"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedAppointment && (
          <div>
            <p>
              <strong>ID:</strong> {selectedAppointment.testDriveId}
            </p>
            <p>
              <strong>Thời gian bắt đầu:</strong>{" "}
              {dayjs(selectedAppointment.scheduledDate).format(
                "DD/MM/YYYY HH:mm"
              )}
            </p>
            <p>
              <strong>Thời gian kết thúc:</strong>{" "}
              {dayjs(selectedAppointment.endDate).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Tag color={getStatusProps(selectedAppointment.status).color}>
                {getStatusProps(selectedAppointment.status).text}
              </Tag>
            </p>
            <p>
              <strong>Khách hàng ID:</strong> {selectedAppointment.customerId}
            </p>
            <p>
              <strong>Xe ID:</strong> {selectedAppointment.vehicleId}
            </p>
            <p>
              <strong>Ghi chú:</strong>{" "}
              {selectedAppointment.notes || "Không có ghi chú"}
            </p>
          </div>
        )}
      </Modal>

      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAppointmentCreated={() => {
          setIsCreateModalOpen(false);
          if (dealerId) {
            fetchTestDrives(dealerId);
          }
        }}
      />
    </>
  );
}
