import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Header from '../../components/Header'
import FlexBetween from '../../components/FlexBetween'


const Dashboard = () => {

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Tableau de board" subtitle="Tableau de board"/>
      </FlexBetween>
    </Box>
  )
}

export default Dashboard