import React from 'react'
import styled from 'styled-components'
import XRay from 'aws-sdk/clients/xray'
import Head from 'next/head'
import XRayInfo from 'react-aws-xray-service-graph'
import getConfig from 'next/config'


const StyledXrayMap = styled(XRayInfo)`
  height: 100vh;
  .react-aws-xray-service-graph-DirectionalGraph {
    height: 100%;
  }
`
export const StatsPage = ({ services }: any) => (
  <div>
    <Head>
      <title>Xray stats</title>
    </Head>
    <StyledXrayMap services={services} />
  </div>
)


StatsPage.getInitialProps = async () => {
  const { serverRuntimeConfig } = getConfig()

  const xray = new XRay({
    region: 'eu-central-1',
    apiVersion: '2016-04-12',
    credentials: {
      accessKeyId: serverRuntimeConfig.AWS_ACCESS_KEY_ID!,
      secretAccessKey: serverRuntimeConfig.AWS_SECRET_ACCESS_KEY!,
    },
  })

  const timePeriod = 60 * 1000 * 60 * 6 // 6 hours
  const params = {
    EndTime: new Date(),
    StartTime: new Date(Date.now() - timePeriod),
  }

  const result = await xray.getServiceGraph(params).promise()

  return {
    services: result.Services || [],
  }
}

export default StatsPage
