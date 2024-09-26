import paramiko, time, re, getpass, argparse
from sqlalchemy import create_engine, MetaData, delete, text
from sqlalchemy.exc import SQLAlchemyError
import pandas as pd
import sys
hh_username = "C15380"
hh_password = "Claro2018+*"
device_host = "rCSRCanal13_2"
device_host2 = "rCSRHospitalMilitar2"
# device_username = "C15380"
# device_password = "Claro4499$$"
device_username = sys.argv[1]
device_password = sys.argv[2]
hh_host = "172.19.216.125"

#connect_server_get_device_command(hh_host,hh_username,hh_password, device_host,device_username,device_password,"display ver"+"\n")

class Spidernet:
    def __init__(self,hh_host,hh_username,hh_password,device_username,device_password):
        self.hh_host = hh_host
        self.hh_username = hh_username 
        self.hh_password = hh_password 
        self.device_username = device_username 
        self.device_password = device_password 
        self.server_client = None
        self.router_client = None
        self.router_connection = None
        self.shell = None
        self.command_result = None
    
    def get_server_client(self):
        try:
            self.server_client = paramiko.SSHClient()
            self.server_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.server_client.connect(self.hh_host, 22, self.hh_username, self.hh_password, banner_timeout=300)
            print("Accediste al servidor HH!!")
            return True
        except Exception as e:
            print(f"Error al conectar al servidor HH: {e}")
            self.server_client = None
            return None
    
    def get_router_client(self,device_host):

        error_pass = None
        while True:
            try:            
                transport = self.server_client.get_transport()
                addr = (device_host, 22) # El puerto 22 es el predeterminado para SSH
                router_conn = transport.open_channel("direct-tcpip", addr, addr)
                self.router_client = paramiko.SSHClient()
                self.router_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                self.router_client.connect(device_host, username=self.device_username, password=self.device_password, sock=router_conn)
                self.shell = self.router_client.invoke_shell()
                print(f"Conexión al router exitosa al {device_host}!")
                return True
            except Exception as e:
                print(f"Error al conectar al router {device_host}: ")
                print(str(e))

                if "uthentication" in str(e):
                    print("Falla de autenticación")
                
                self.router_client = None

                return None
    
    def get_data_from_command_test(self,command):
        try:
            brand = ""
            self.shell.send(command)
            time.sleep(2)  # Espera un poco para que el comando se ejecute
            output = ""
            count = 0
            while self.shell.recv_ready():
                output += self.shell.recv(1024).decode()
            # while True:
            #     count += 1
            #     print(count)
            #     print(self.shell.recv_ready())
                
            #     if self.shell.recv_ready():
            #         output += self.shell.recv(1024).decode()
            #         break
            #     else:
            #         time.sleep(0.1)  # Espera un poco antes de verificar nuevamente

                # Si no hay más datos disponibles y el comando ha terminado, sal del bucle
                # if not self.shell.recv_ready() and self.shell.exit_status_ready():
                #     break
                # if count > 100:
                #     print(self.shell)
                #     print("muchas repeticiones")
                #     break

            # self.shell.send(chr(3))
            # time.sleep(2)
            self.command_result = output
            return True
        except Exception as e:
            print("error al mandar comando de router: ")
            print(e)
            return None
    
    def get_data_from_command_once(self,command):
        try:
            brand = ""
            self.shell.send(command)
            time.sleep(2)  # Espera un poco para que el comando se ejecute
            output = ""
            while self.shell.recv_ready():
                output += self.shell.recv(1024).decode()

            if "Error" in output:
                self.shell.send("show ver"+"\n")
                time.sleep(2)
                output = ""
                while self.shell.recv_ready():
                    output += self.shell.recv(1024).decode()
            
            self.shell.send(chr(3))
            time.sleep(2)
            self.command_result = output
            return True
        except Exception as e:
            print("error al mandar comando de router: ")
            print(e)
            return None
        
    def get_data_from_command_more(self, command, ending):
        try:
            self.shell.send(command)
            time.sleep(2)  # Espera un poco para que el comando se ejecute
            output = ""
            #print("111111111111111111111111111111111111111111111111111111111111111")
            counter = 0
            while True:
                
                thisGroup = ""
                while self.shell.recv_ready():
                    thisGroup += self.shell.recv(1024).decode()
                    # print(thisGroup)
                output += thisGroup
                counter +=1
                
                if "More" in thisGroup:
                    self.shell.send("                                                                                                                        ")
                    time.sleep(2)
                if thisGroup:
                    # print("######################################################")
                    # print("######################################################")
                    # print(thisGroup.splitlines()[-1], "|||Last")
                    if any(element in ending for element in thisGroup.splitlines()[-1]):
                        print("data command procesada por ultima linea")
                        break

                if counter > 150:
                    print("-------------------------")
                    print("data command procesada por mas de 150 repeticiones")
                    break
                    
                # print(counter)
                
            self.shell.send(chr(3))
            time.sleep(2)
            self.command_result = output
            return True
    
        except Exception as e:
            print(f"Error al ejecutar el comando: {e}")
            return None
    
    def get_brand(self):
        try:
            brand = ""
            
            self.shell.send("display ver"+"\n")
            time.sleep(2)  # Espera un poco para que el comando se ejecute
            output = ""
            while self.shell.recv_ready():
                output += self.shell.recv(1024).decode()

            if "uawei" in output:
                brand = "Huawei"
            self.shell.send(chr(3))
            # time.sleep(2)
            print(brand)
            return True
        except Exception as e:
            print("error al mandar comando de router: ")
            print(e)
            return None

    def get_command_result(self,device_host,command):
        try:
            self.get_server_client()
            if self.server_client:
                self.get_router_client(device_host)
                if self.router_client:
                    self.get_brand()
                    self.get_data_from_command_more(command,["#",">"])
                    self.router_client.close()
                self.server_client.close()

        except Exception as e:
            print("Error general: ")
            print(e)

    
    def format_interface_huawei_filtered_internacional(self,text):
        text_to_bloq = re.split(r"\#", text)
        data_info = [bloq.splitlines() for bloq in text_to_bloq]
        data_filtered = [bloq for bloq in data_info if any("Traffic_QoS_IN_SalidasInt" in linea for linea in bloq)]
        print(len(data_filtered))
        formated = []

        for group in data_filtered:
            #print("------------")
            interface = {}
            for line in group:
                if "terface" in line:
                    interface["interface"] = line
                if "escrip" in line:
                    interface["description"] = line
                if "ip address" in line:
                    interface["ipv4"] = line
                if "ipv6 address" in line:
                    interface["ipv6"] = line 
            #print(interface)
            formated.append(interface)
        
        #print(formated)
        return formated
    
    def format_interface_huawei_all(self,text):
        text_to_bloq = re.split(r"\#", text)
        data_info = [bloq.splitlines() for bloq in text_to_bloq]
        #data_filtered = [bloq for bloq in data_info if any("Traffic_QoS_IN_SalidasInt" in linea for linea in bloq)]
        #print(len(data_filtered))
        formated = []

        for group in data_info:
            #print("------------")
            interface = {}
            interface["international"] = False
            interface["trunk"] = ""
            interface["kind"] = "other"
            interface["description"] = ""
            interface["ipv4"] = ""
            interface["ipv6"] = ""
            interface["interface"] = ""
            for line in group:
                patron = "16D"
                if patron in line and "More" in line:
                    line = line.split("16D")[-1]
                #print(line)
                if "terface" in line:
                    interface["interface"] = line
                    if "Eth-Trunk" in line:
                        interface["kind"] = "trunk"
                    elif "GigabitEthernet" in line:
                        interface["kind"] = "10"
                    # elif "50|100GE" in line:
                    #     interface["kind"] = "50|100"
                    elif "100GE" in line:
                        interface["kind"] = "100"

                if "escrip" in line:
                    interface["description"] = line
                if "ip address" in line:
                    interface["ipv4"] = line
                if "ipv6 address" in line:
                    interface["ipv6"] = line
                if "Traffic_QoS_IN_SalidasInt" in line:
                    interface["international"] = True  
                if "eth-trunk" in line:
                    interface["trunk"] = line  
            #print(interface)
            formated.append(interface)
        
        #print(formated)
        return formated

    def get_configuration_huawei(self,device_host):
        try:
            self.get_server_client()
            if self.server_client:
                self.get_router_client(device_host)
                if self.router_client:
                    self.get_data_from_command_more("display current-configuration interface eth-tru"+"\n",[">"])
                    #print(self.command_result)
                    self.format_interface_huawei_all(self.command_result)
                    self.get_data_from_command_more("display current-configuration interface giga"+"\n",[">"])
                    #self.format_interface_huawei_filtered_internacional(self.command_result)
                    self.router_client.close()
                self.server_client.close()
        except Exception as e:
            print("Error obteniendo la configuración: ")
            print(e)

    def get_internacional_links_huawei(self):
        try:
            self.get_server_client()
            devices = ["rMPLSVillaSalvadorBR01","rMPLSPolo1BR02","rMPLSVillaSalvadorBR03","rMPLSPolo1BR04"]
            inteface_list_to_upload = pd.DataFrame()
            if self.server_client:
                for device in devices:
                    self.get_router_client(device)
                    if self.router_client:
                        #self.get_data_from_command_more("display current-configuration interface eth-tru"+"\n",[">"])
                        #print(self.command_result)
                        self.get_data_from_command_more("display current-configuration interface "+"\n",[">"])
                        all_interfaces = self.format_interface_huawei_all(self.command_result)
                        #all_interfaces = [ interfaces for interfaces in all_interfaces if interfaces["international"]]
                        trunk_list = [ interface for interface in all_interfaces if interface["international"] and interface["kind"] == "trunk"]
                        only_number_trunk = [re.findall(r"Eth-Trunk(\d+)",interface["interface"])[0] for interface in trunk_list]
                        print(only_number_trunk)
                        no_trunk_list = [ interface for interface in all_interfaces if interface["international"] and interface["kind"] != "trunk"]
                        split_trunk_in_interfaces = [ interface for interface in all_interfaces if any(trunk in re.findall(r'\d+', interface["trunk"]) for trunk in only_number_trunk)]
                        all_international_interfaces = no_trunk_list + split_trunk_in_interfaces
                        description_internationals = [interface["description"] for interface in all_international_interfaces]
                        # for line in all_international_interfaces:
                        #     print(line["interface"])
                        #     print(line["description"])
                        #     print("")
                        selected_rows = ['interface', 'description', 'kind', 'trunk', 'ipv4', 'ipv6']
                        df = pd.DataFrame(all_international_interfaces)
                        df_to_upload = df[selected_rows]
                        df_to_upload["source"] = device
                        df_trunk = pd.DataFrame(trunk_list)
                        df_trunk_to_upload = df_trunk[selected_rows]
                        df_trunk_to_upload["source"] = device
                        inteface_list_to_upload = pd.concat([inteface_list_to_upload,df_to_upload,df_trunk_to_upload], ignore_index=True)
                        
                        
                        #trunk_list = sorted(list(set(trunk_list)))
                        # print("##########################")
                        # print("Cantidad")
                        # print(len(description_internationals))
                        # print("##########################")
                        # print(description_internationals)
                        # self.get_data_from_command_more("display current-configuration interface giga"+"\n",[">"])
                        # giga_interfaces = self.format_interface_huawei_all(self.command_result)
                        # giga_interfaces = [ interfaces for interfaces in giga_interfaces if interfaces["international"] or interfaces["trunk"]]

                        # print(giga_interfaces)
                        self.router_client.close()
                    
                    else:
                        self.server_client.close()
                        print("Error en la conexión al router")
                        raise ValueError("Deteniendo la ejecución en este router")
                self.server_client.close()

                engine = create_engine('postgresql+psycopg2://postgres:Subida20@172.19.128.128:5432/NOC')
                inteface_list_to_upload.to_sql('Ip_InternationalLinksFromScript', engine, if_exists='replace', index=False)
                print("successfully executed")
            else:
                print("Error en el servidor HH")
                
        except Exception as e:
            print("Error obteniendo la configuración de los BR: ")
            print(e)

command = "display ver"+"\n"

get_display = Spidernet(hh_host,hh_username,hh_password,device_username,device_password)
# get_display.get_command_result(device_host,command)
# print(get_display.command_result)
# get_display.get_command_result(device_host2,command)
# print(get_display.command_result)
# get_display.get_configuration_huawei("rMPLSPolo1BR02")
# get_display.get_configuration_huawei("rMPLSVillaSalvadorBR01")
# get_display.get_configuration_huawei("rMPLSVillaSalvadorBR03")

get_display.get_internacional_links_huawei()