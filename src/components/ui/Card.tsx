import React from "react";
import { cn } from "../../utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow overflow-hidden",
        hoverable &&
          "transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-200", className)}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn("px-6 py-4 bg-gray-50 border-t border-gray-200", className)}
    >
      {children}
    </div>
  );
};

export default { Card, CardHeader, CardBody, CardFooter };
