using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;

using System.Configuration;     
using MySql.Data.MySqlClient;
using System.Text;

namespace FinalGame
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        public void Page_Load(object sender, EventArgs e)
        {

        }

        public void Login(object sender, EventArgs e)
        {
            Controller cont = new Controller();
            string pass = Password.Text;
            string user = Username.Text;
            if (cont.TryLogin(user, pass) != -1)
            {
                HttpContext.Current.Response.Redirect("~/341_Game.aspx");
            } else
            {
                Username.Text = "Login Failed";
                Password.Text = "";
            }
        }

        public void NewUser(object sender, EventArgs e)
        {
            Controller cont = new Controller();
            string pass = Password.Text;
            string user = Username.Text;
            info.Text = cont.NewUser(user, pass);
        }
    }
}

public class Controller
{
    char[] Symbols = { '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '`', '~', '[', ']', '{', '}', '\\', '|', ':', ';', '\'', '\"', ',', '<', '.', '>', '/', '?'};
    Database db = new Database();
    public int TryLogin(string username, string password)
    {
        string hPass = Hash(password);
        if (db.UsernamePasswordCheck(username, hPass))
        {
            return db.GetUserID(username);
        }

        return -1;
    }

    public string NewUser(string username, string password)
    {
        if(!VerifyGoodPassword(password))
        {
            return "Your password doesnt meet the requirements! 1 Symbol and 1 number please!";
        }
        string hPass = Hash(password);
        if (db.CheckAvailableUsername(username))
            return db.CreateNewUser(username, hPass);
        return "That username Already Exists!";
    }

    private string Hash(string text)
    {
        var hash = new SHA1Managed().ComputeHash(Encoding.UTF8.GetBytes(text));
        string hashbrown = string.Concat(hash.Select(b => b.ToString("x2")));
        return hashbrown;
    }

    private Boolean VerifyGoodPassword(string password)
    {
        bool SymbolIncluded = false;
        bool NumberIncluded = false;
        for(int i = 0; i < Symbols.Length; i++)
        {
            if(password.Contains(Symbols[i]))
            {
                SymbolIncluded = true;
            }
            if(password.Contains(i+""))
            {
                NumberIncluded = true;
            }
        }

        if (SymbolIncluded == true && NumberIncluded == true)
        {
            return true;
        }

        return false;
    }
}



public class Database
{
    static private string connectionStringToDB = ConfigurationManager.ConnectionStrings["MySQLDB"].ConnectionString;

    public Boolean UsernamePasswordCheck(string username, string password)
    {
        MySqlConnection conn = new MySqlConnection(connectionStringToDB);
        conn.Open();

        MySqlCommand checkUsernamePassword = new MySqlCommand("SELECT password FROM GameData WHERE username = @user", conn);
        checkUsernamePassword.Parameters.Add(new MySqlParameter("user", username));
        MySqlDataReader reader = checkUsernamePassword.ExecuteReader();
        int count = reader.FieldCount;

        StringBuilder str = new StringBuilder();

        while (reader.Read())
        {
            for (int i = 0; i < count; i++)
            {
                str.Append(reader.GetValue(i));
            }
        }

        conn.Close();

        if(str + "" == password)
            return true;

        return false;
    }

    public int GetUserID(string username)
    {
        MySqlConnection conn = new MySqlConnection(connectionStringToDB);
        conn.Open();

        MySqlCommand getUserId = new MySqlCommand("SELECT playerid FROM GameData WHERE username = @user", conn);
        getUserId.Parameters.Add(new MySqlParameter("user", username));
        MySqlDataReader reader = getUserId.ExecuteReader();
        int count = reader.FieldCount;

        StringBuilder str = new StringBuilder();

        while (reader.Read())
        {
            for (int i = 0; i < count; i++)
            {
                str.Append(reader.GetValue(i));
            }
        }
        string userid = str + "";

        conn.Close();
        if (userid == "")
            return -1;
        return Convert.ToInt32(userid);
    } 

    public Boolean CheckAvailableUsername(string username)
    {
        int userid = GetUserID(username);
        if(userid == -1)
            return true;

        return false;
    }

    public string CreateNewUser(string username, string password)
    {
        MySqlConnection conn = new MySqlConnection(connectionStringToDB);
        conn.Open();
        try
        {
            MySqlCommand newUser = new MySqlCommand("INSERT INTO `GameData`(`playerid`, `username`, `password`, `storyprogress`) VALUES(null, @user, @pass, 0)", conn);
            newUser.Parameters.Add(new MySqlParameter("user", username));
            newUser.Parameters.Add(new MySqlParameter("pass", password));
            newUser.ExecuteNonQuery();

            return "Your account was Made successfully!";
        }
        catch (Exception ex)
        {
            return "Something went wrong on our end! Please try again later!";

        }
        finally
        { 
            conn.Close();
            CreateStatsForUser(username);
            CreateInventoryForUser(username);
        }
    }   

    private void CreateStatsForUser(string username)
    {
        MySqlConnection conn = new MySqlConnection(connectionStringToDB);
        conn.Open();

        int userID = GetUserID(username);
        MySqlCommand newUserStats = new MySqlCommand("INSERT INTO `PlayerStats`(`uid`, `attack`, `magic`, `defense`, `hp`, `statsid`) VALUES(@userid, 0, 0, 0, 100, null)", conn);
        newUserStats.Parameters.Add(new MySqlParameter("userid", userID));
        newUserStats.ExecuteNonQuery();

        conn.Close();
    }

    private void CreateInventoryForUser(string username)
    {
        MySqlConnection conn = new MySqlConnection(connectionStringToDB);
        conn.Open();

        int userID = GetUserID(username);
        MySqlCommand newUserInv = new MySqlCommand("INSERT INTO `InventoryDatabase`(`inventoryid`, `uid`, `iid`) VALUES(null, @uid, 1)", conn);
        newUserInv.Parameters.Add(new MySqlParameter("uid", userID));
        newUserInv.ExecuteNonQuery();

        conn.Close();
    }
}