<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="FinalGame.WebForm1" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <script type="text/javascript">
                function checkCred(user, pass) {
                    
                }
            </script>
            <asp:TextBox runat="server" id="Username" name="Username" type="text"/>
            <br/>
            <asp:TextBox runat="server" id="Password" type="password"/>
            <br/>
            <asp:Button runat="server" onclick ="Login" text="Submit"/>
            <asp:Button runat="server" onclick ="NewUser" text="Create New Account" />
            <br/>
            <asp:TextBox Width="350" runat="server" id="info" type="text" isEnabled="false" ReadOnly="true" style="border:none" Text="Passwords must inclue one number and one symbol!"/>
        </div>
    </form>
</body>
</html>
