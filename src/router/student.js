const Main = r => require.ensure([], () => r(require('@/components/Main')), 'Main')

const JobLayout = r => require.ensure([], () => r(require('@/components/student/job/Layout')), 'Job')
const JobCurrent = r => require.ensure([], () => r(require('@/components/student/job/JobCurrent')), 'Job')
const JobHistory = r => require.ensure([], () => r(require('@/components/student/job/JobHistory')), 'Job')

const RecruitingJob = r => require.ensure([], () => r(require('@/components/student/job/RecruitingJob')), 'Job')

const FeedbackLayout = r => require.ensure([], () => r(require('@/components/student/feedback/Layout')), 'Feedback')
const FeedbackCurrent = r => require.ensure([], () => r(require('@/components/student/feedback/Current')), 'Feedback')
const FeedbackHistory = r => require.ensure([], () => r(require('@/components/student/feedback/History')), 'Feedback')

const CheckRecord = r => require.ensure([], () => r(require('@/components/student/other/Check')), 'Other')
const FundRecord = r => require.ensure([], () => r(require('@/components/student/other/Fund')), 'Other')

export default {
  path: '/student',
  component: Main,
  children: [
    {
      path: 'job',
      component: JobLayout,
      children: [
        {
          path: '/',
          redirect: 'current'
        },
        {
          path: 'current',
          component: JobCurrent
        },
        {
          path: 'history',
          component: JobHistory
        }
      ]
    },
    {
      path: 'recruiting_job',
      component: RecruitingJob
    },
    {
      path: 'feedback',
      component: FeedbackLayout,
      children: [
        {
          path: 'current',
          component: FeedbackCurrent
        },
        {
          path: '/',
          redirect: 'current'
        },
        {
          path: 'history',
          component: FeedbackHistory
        }
      ]
    },
    {
      path: 'check',
      component: CheckRecord
    },
    {
      path: 'fund',
      component: FundRecord
    }
  ]
}
