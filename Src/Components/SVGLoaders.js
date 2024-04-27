import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import React from "react";

const ExpenseWeekLoaderHeader = () => (
    <ContentLoader speed={1.2} interval={0.1}>
      
      <Rect x="25" rx="2" ry="2" width="230" height="20" />
      <Rect x="320" rx="2" ry="2" width="50" height="20" />
      
    </ContentLoader>
  );
  
  const ExpenseWeekLoader = () => (
    <ContentLoader speed={1.2} interval={0.1}>
      
      <Rect x="10" rx="2" ry="2" width="150" height="13" />
      <Rect x="250" rx="2" ry="2" width="90" height="13" />
      <Rect x="10"  y="32" rx="2" ry="2" width="100" height="15" />
      <Rect x="250" y="32" rx="2" ry="2" width="100" height="15" />
      <Rect x="10"  y="54" rx="2" ry="2" width="70" height="13" />
      <Rect x="220" y="54" rx="2" ry="2" width="130" height="13" />
  
      <Rect x="10"  y="100" rx="2" ry="2" width="100" height="15" />
      <Rect x="250" y="100" rx="2" ry="2" width="100" height="15" />
      <Rect x="10"  y="122" rx="2" ry="2" width="70" height="13" />
      <Rect x="220" y="122" rx="2" ry="2" width="130" height="13" />
  
      <Rect x="10"  y="168" rx="2" ry="2" width="100" height="15" />
      <Rect x="250" y="168" rx="2" ry="2" width="100" height="15" />
      <Rect x="10"  y="190" rx="2" ry="2" width="70" height="13" />
      <Rect x="220" y="190" rx="2" ry="2" width="130" height="13" />
  
    </ContentLoader>
  );

  const WeeklyExpensesLoader = () => (
    <ContentLoader speed={1.2} interval={0.1}>
        <Rect x="5"  y="10" rx="2" ry="2" width="54" height="30" />
        <Rect x="90"  y="15" rx="2" ry="2" width="160" height="20" />
        <Rect x="280"  y="12" rx="2" ry="2" width="55" height="25" />
    </ContentLoader>
  )

  const WeeklyExpensesGraphLoader = () => (
    <ContentLoader speed={1.2} interval={0.1}>
        <Rect x="5"  y="10" rx="2" ry="2" width="330" height="335" />
    </ContentLoader>
  )

  export {ExpenseWeekLoaderHeader, ExpenseWeekLoader, WeeklyExpensesLoader, WeeklyExpensesGraphLoader};