const Main = r => require.ensure([], () => r(require('@/components/Main')), 'Main')

export default {
  path: '/',
  component: Main
}
