const Main = r => require.ensure([], () => r(require('@/components/Main')), 'Main')

const JobLayout = r => require.ensure([], () => r(require('@/components/unit/job/Layout')), 'Job')
const JobCurrent = r => require.ensure([], () => r(require('@/components/unit/job/Current')), 'Job')
const JobHistory = r => require.ensure([], () => r(require('@/components/unit/job/History')), 'Job')

const JobApplication = r => require.ensure([], () => r(require('@/components/unit/job/Application')), 'Job')

const RecruitLayout = r => require.ensure([], () => r(require('@/components/unit/recruit/Layout')), 'Recruit')
const RecruitManage = r => require.ensure([], () => r(require('@/components/unit/recruit/Manage')), 'Recruit')
const RecruitCheck = r => require.ensure([], () => r(require('@/components/unit/recruit/Check')), 'Recruit')

const RecruitApplication = r => require.ensure([], () => r(require('@/components/unit/recruit/Application')), 'Recruit')

const CheckLayout = r => require.ensure([], () => r(require('@/components/unit/check/Layout')), 'Check')
const CheckList = r => require.ensure([], () => r(require('@/components/unit/check/List')), 'Check')
const CheckIndividual = r => require.ensure([], () => r(require('@/components/unit/check/IndividualCheck')), 'Check')
const CheckTotal = r => require.ensure([], () => r(require('@/components/unit/check/TotalCheck')), 'Check')

export default {
  path: '/unit',
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
      path: 'job_application',
      component: JobApplication
    },
    {
      path: 'recruit',
      component: RecruitLayout,
      children: [
        {
          path: '/',
          component: RecruitManage
        },
        {
          path: 'check/:id',
          component: RecruitCheck
        }
      ]
    },
    {
      path: 'recruit_application',
      component: RecruitApplication
    },
    {
      path: 'check',
      component: CheckLayout,
      children: [
        {
          path: '/',
          component: CheckList
        },
        {
          path: 'individual/:id/:year/:month',
          component: CheckIndividual
        },
        {
          path: 'total/:year/:month',
          component: CheckTotal
        }
      ]
    }
  ]
}
