﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="FinalGame.WebForm1" %>
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
            <input id="Username" name="Username" type="text"/>
            <br/>
            <asp:TextBox runat="server" id="Password"/>
            <br/>
            <asp:Button runat="server" onclick="Hash" />


            <script type="text/javascript">
                function bruh() {
                    var u = document.getElementById('Username').value;
                    var p = document.getElementById('Password').value;
                    var list = "<%=Login()%>";
                    var hash = Hash();
                    var all = list.split("&");
                    for (var i = 0; i < all.length; ++i) {
                        var pass = eval(hash);
                        pass = pass(p);
                        if (all[i].includes(u) == true) {
                            document.getElementsByName('enter').disable();

                        }
                    }
                }

                /*onclick="checkCred(document.getElementsByName('Username'), document.getElementsByName('Password'))"*/
            </script>
        </div>
    </form>
</body>
</html>