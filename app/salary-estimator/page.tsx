import SalaryEstimator from "@/components/SalaryEstimatorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Salary Estimator',
  description: 'Estimate your market value and negotiate better salaries with real-time data.',
};



export default function SalaryEstimatorPage() {

  return (
   <SalaryEstimator/>
  );
}
