import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Header from '../../components/Header'
import FlexBetween from '../../components/FlexBetween'


const Campaigns = () => {

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Campaigns" subtitle="Gérer vos campagnes" />
      </FlexBetween>
    </Box>
  )
}

export default Campaigns