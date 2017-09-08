const Main = r => require.ensure([], () => r(require('@/components/Main')), 'Main')

const Unit = r => require.ensure([], () => r(require('@/components/school/job/Unit')), 'Job')
const JobCheck = r => require.ensure([], () => r(require('@/components/school/job/JobCheck')), 'Job')

const RecruitCurrent = r => require.ensure([], () => r(require('@/components/school/recruit/Current')), 'Recruit')
const HistoryRecruitLayout = r => require.ensure([], () => r(require('@/components/school/recruit/Layout')), 'Recruit')
const HistoryRecruitList = r => require.ensure([], () => r(require('@/components/school/recruit/List')), 'Recruit')
const HistoryRecruitDetail = r => require.ensure([], () => r(require('@/components/school/recruit/Detail')), 'Recruit')

const CheckLayout = r => require.ensure([], () => r(require('@/components/school/check/Layout')), 'Check')
const JobList = r => require.ensure([], () => r(require('@/components/school/check/JobList')), 'Check')
const FundRelease = r => require.ensure([], () => r(require('@/components/school/check/FundRelease')), 'Check')
const CheckDetail = r => require.ensure([], () => r(require('@/components/school/check/Check')), 'Check')

export default {
  path: '/school',
  component: Main,
  children: [
    {
      path: 'unit',
      component: Unit
    },
    {
      path: 'job_check',
      component: JobCheck
    },
    {
      path: 'c_recruit',
      component: RecruitCurrent
    },
    {
      path: 'recruit',
      component: HistoryRecruitLayout,
      children: [
        {
          path: '/',
          redirect: 'history'
        },
        {
          path: 'history',
          component: HistoryRecruitList
        },
        {
          path: 'detail/:id/:name',
          component: HistoryRecruitDetail
        }
      ]
    },
    {
      path: 'check',
      component: CheckLayout,
      children: [
        {
          path: '/',
          redirect: 'list'
        },
        {
          path: 'list',
          component: JobList
        },
        {
          path: 'release/:year/:month',
          component: FundRelease
        },
        {
          path: 'detail/:id/:year/:month',
          component: CheckDetail
        }
      ]
    }
  ]
}
