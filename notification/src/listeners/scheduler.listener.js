import MonthlyNewsletterScheduler from '../service/scheduler/schedule/monthly-newsletter.scheduler';

const schedulerListener = () => {
  const monthlyNewsletterScheduler = new MonthlyNewsletterScheduler();
  monthlyNewsletterScheduler.proceed();
};

export default schedulerListener;
