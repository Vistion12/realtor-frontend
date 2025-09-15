"use client";

import { useState } from "react";
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface Props {
  text: string;
  maxLength?: number;
}

export const ExpandableText = ({ text, maxLength = 150 }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const needsTruncation = text.length > maxLength;
  const displayText = isExpanded || !needsTruncation 
    ? text 
    : `${text.substring(0, maxLength)}...`;

  return (
    <div>
      <p style={{ 
        margin: 0,
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {displayText}
      </p>
      {needsTruncation && (
        <Button 
          type="link" 
          onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
          style={{ padding: 0, height: 'auto', fontSize: '12px', marginTop: '8px' }}
        >
          {isExpanded ? 'Свернуть' : 'Подробнее'}
        </Button>
      )}
    </div>
  );
};