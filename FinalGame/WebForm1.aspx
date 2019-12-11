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
            <asp:TextBox runat="server" id="Username"/>
            <br/>
            <asp:TextBox runat="server" id="Password"/>
            <br/>
            <asp:Button runat="server" onclick="Hash" text ="Submit"/>
        </div>
    </form>
</body>
</html>
