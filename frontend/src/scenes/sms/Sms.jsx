import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Header from '../../components/Header'
import FlexBetween from '../../components/FlexBetween'


const Sms = () => {

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Sms" subtitle="Envoyer des sms"/>
      </FlexBetween>
    </Box>
  )
}

export default Sms