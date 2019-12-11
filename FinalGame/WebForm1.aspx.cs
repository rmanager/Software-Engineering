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

        static public object Login()
        {
            object a = Controller.Login();
            return a;
        }

        public void Hash(object sender, EventArgs e)
        {
            string input = Password.Text;
            var hash = new SHA1Managed().ComputeHash(Encoding.UTF8.GetBytes(input));
            String hashbrown = string.Concat(hash.Select(b => b.ToString("x2")));
            Password.Text = hashbrown;
            HttpContext.Current.Response.Redirect("~/341_Game.aspx");
        }

    }
}

public class Controller
{
    public static object Login()
    {
        object a = Database.FuckSecurity();
        return a;

    }
}

public class Database
{
    static private string connectionStringToDB = ConfigurationManager.ConnectionStrings["MySQLDB"].ConnectionString;

    public static string Hash(string input)
    {
        var hash = new SHA1Managed().ComputeHash(Encoding.UTF8.GetBytes(input));
        return string.Concat(hash.Select(b => b.ToString("x2")));
    }

    public static object FuckSecurity()
    {
        MySqlConnection conn = new MySqlConnection(connectionStringToDB);
        conn.Open();
        /*
        MySqlCommand mycmd = new MySqlCommand("SELECT username FROM GameData", conn);
        MySqlDataReader reader1 = mycmd.ExecuteReader();
        int count1 = reader1.FieldCount;

        String arr1 = "";

        while (reader1.Read())
        {
            for (int i = 0; i < count1; i++)
            {
                arr1 += (reader1.GetValue(i) + "\n");
            }
        }
        conn.Close();
        conn.Open();
        MySqlCommand mycmd2 = new MySqlCommand("SELECT password FROM GameData", conn);
        MySqlDataReader reader2 = mycmd2.ExecuteReader();
        int count2 = reader2.FieldCount;

       //String[] arr2 = new String[count2];

        String arr2 = "";

        while (reader2.Read())
        {
            for (int i = 0; i < count2; i++)
            {
                arr2 += (reader2.GetValue(i) + "\n");
            }
        }
        conn.Close();
        conn.Open();
        MySqlCommand mycmd3 = new MySqlCommand("SELECT playerid FROM GameData", conn);
        MySqlDataReader reader3 = mycmd3.ExecuteReader();
        int count3 = reader3.FieldCount;

        //String[] arr3 = new String[count2];

        String arr3 = "";

        while (reader3.Read())
        {
            for (int i = 0; i < count3; i++)
            {
                arr3 += (reader3.GetValue(i) + "\n");
            }
        }

        conn.Close();
        */
        MySqlCommand mycmd3 = new MySqlCommand("SELECT * FROM GameData", conn);
        MySqlDataReader reader3 = mycmd3.ExecuteReader();
        int count3 = reader3.FieldCount;

        //String[] arr3 = new String[count2];

        StringBuilder arr3 = new StringBuilder();

        while (reader3.Read())
        {
            for (int i = 0; i < count3; i++)
            {
                arr3.Append(reader3.GetValue(i) + " ");
            }
            arr3.Append("&");
        }
        string HackMe = arr3 + "";
        /*
        for(int i = 0; i < count2; i++)
        {
            HackMe = HackMe + arr3[i] + arr1[i] + arr2[i]+"&";
        }
        */
        return HackMe;
    }
}