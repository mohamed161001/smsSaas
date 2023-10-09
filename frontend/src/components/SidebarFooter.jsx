import styled from '@emotion/styled';
import React from 'react';
import { Avatar, IconButton } from '@mui/material';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';

const StyledSidebarFooter = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

const StyledLogo = styled.div`
  width: 35px;
  min-width: 35px;
  height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  background-color: #009fdb;
  background: linear-gradient(45deg, rgb(21 87 205) 0%, rgb(90 225 255) 100%);
  ${({ rtl }) =>
    rtl
      ? `
      margin-left: 10px;
      margin-right: 4px;
      `
      : `
      margin-right: 10px;
      margin-left: 4px;
      `}
`;

const SidebarFooter = ({ children, rtl, ...rest }) => {
  return (
    <StyledSidebarFooter {...rest}>
      <div style={{ display: 'flex', alignItems: 'center'}}>
        {/* <StyledLogo rtl={rtl}>P</StyledLogo> */}
        <Avatar alt="Remy Sharp" src="https://fastly.picsum.photos/id/155/200/300.jpg?hmac=nG5WHfEXcJmld5FbH0N9bGciE9a57S0bgIHHTpxag7o" />

        <p style={{ marginLeft: '1rem' }}>Rayen Inoubli</p>

      </div>

      <IconButton>
        <ManageAccountsRoundedIcon />
      </IconButton>
      
    </StyledSidebarFooter>
  );
};

export default SidebarFooter;