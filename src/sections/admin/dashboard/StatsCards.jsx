import React from "react";
import { Row, Col, Card } from "antd";

const StatsCards = ({ stats }) => {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      {stats.map((stat, index) => (
        <Col key={index} xs={24} sm={12} lg={8} xl={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span style={{ fontSize: "24px", color: stat.color }}>
                {stat.icon}
              </span>
              <span className="text-gray-600">{stat.title}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.prefix}{stat.value}{stat.suffix}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
